/*-----------------------------------------------------------------------
   * @ file        : users.js
   * @ description : Includes all users controller operations.
   * @ author      : Duddukuri Mahesh
   * @ date        : 20/09/2017.
-----------------------------------------------------------------------*/

`use strict`;

/*--------------------------------------------
    * Include internal and external modules.
---------------------------------------------*/
const async    = require('async');
const Utils    = require(`../Utils`);
const jwt      = require('jsonwebtoken');
const errMsg   = Utils.error_res;
const succMsg  = Utils.success_res;
const Services = require(`../Services`);
const Models   = require('../Models');
const Configs  = require('../Configs');

module.exports = {

	// register new user.
    register      : (request, callback) => {

        async.waterfall([

            // Get the no:of users from DB to genertate the empId in sequence order.
            cb => { 

                Models.users.find().lean().count().exec((err,res) => {
                    if(res>=0){
                        cb(null, {empId: `AV-${res+1}`})
                    } else {
                        cb(errMsg.systemError);
                    }
                });
            },

            // generate accessToken and send back to the user.
            (data,cb) => { 

                const userObj = {
                    role    : request.role,
                    empId   : data.empId,
                    name    : request.name,
                    email   : request.email,
                    password: Utils.universal_fns.encryptpassword(request.password)
                };
                // save user in DB.
                Services.users.register(userObj, (err, res) => cb(err, res))
            }

        ],callback);
    },
  
    // user login.
    login         : (params, callback) => {

        async.waterfall([

            // Check user credentials are valid or not.
            cb => { 

                const queryObj = {
                    email       : params.email,
                    password    : Utils.universal_fns.encryptpassword(params.password),
                    isDeleted   : false
                };
                //Services.users.getUserDetails(queryObj,``,{}, (err, res) => cb(err, res))
                Models.users.findOne(queryObj).exec((err,res) => {
                    if (res) {  
                        if (res.is_suspended) {
                            cb(errMsg.suspended)
                        }else {

                            let tokenObj = {
                                _id  : res._id,
                                email: res.email,
                                role : res.role
                            };
                            // Generate access token.
                            let accessToken = jwt.sign(tokenObj,Configs.consts.JWT_KEY, { algorithm: Configs.consts.JWT_ALGO, expiresIn: '2 days' });

                            let data = {
                                user_id     : res._id,
                                accessToken : accessToken,
                                user_data   : tokenObj
                            };
                            cb(null,data)
                        }
                    }else {
                        cb(err || errMsg.provideValidField(`credentials`))
                    }
                });
            },

            // generate accessToken and send back to the user.
            (data,cb) => { 

                let queryObj = {
                    _id: data.user_id
                },
                updateObj = {
                    accessToken : data.accessToken
                },
                options = {
                    upsert: false,
                    new   : true
                };
                Models.users.findOneAndUpdate(queryObj,updateObj,options).lean().exec((err,res) => {
                    if (res) {
                        data.user_data._id = res._id;
                        let response = {
                            login_token: res.accessToken,
                            user_data  : data.user_data
                        };
                        cb(null,response);
                    }else
                        cb(errMsg.systemError)
                });
            }

        ],callback);
    },

    // Update user profile.
    updateProfile : (request, callback) => {

        async.waterfall([

            // Check the user is auth or not to update profile.
            cb => { 

                if(request.preData.role == 0){     // allow user if Admin.
                    cb(null, request)
                }else if(request.preData._id == request.payload._id){   // allow if user wants to update his /her profile.
                    cb(null, request)                                   
                }else{
                    cb(errMsg.unAuthAccess)
                }
            },

            // Update the user profile.
            (data,cb) => { 

                let queryObj = {
                    _id: request.payload._id
                };
                let updateObj = {
                    name  : request.payload.name,
                    email : request.payload.email
                };
                Services.users.updateOneAndgetUpdatedDataQry(queryObj, updateObj, {new: true}, (err, res) => cb(err, res))
                
                /*Models.users.findOneAndUpdate(queryObj,updateObj,{new: true}).lean().exec((err,res) => {
                    if (res) {
                        callback(null, succMsg.profileUpdated(res));
                    }else
                        callback(err || errMsg.systemError)
                });*/
            }

        ],callback);
    },

    // List all Employees.
    listUsers     : (request, callback) => {

        let queryObj = {
            role       : 1,
            isSuspended: false,
            isDeleted  : false,
            isConfirmed: true
        };
        Services.users.listUsers(queryObj, {}, {}, (err, res) => cb(err, res))
    },

    // user logOut.
    logOut        : (request, callback) => {
        let queryObj = { _id: request._id },
            updateObj= { accessToken : `` };

        Models.users.findOneAndUpdate(queryObj,updateObj).lean().exec((err,res) => {
            if (res) {
                callback(null, succMsg.loOut);
            }else
                callback(err || errMsg.systemError)
        });
    },

    // Api to finding the best employee in terms of maintaining hardware.
    bestEmp       : (request, callback) => {

        async.waterfall([

            // Get the no:of employees have hardwares.
            cb => { 
                const pipeline = [
                    {
                        $match:{
                            isDeleted: false
                        }
                    },
                    {
                        $project: {
                            _id      : 0,
                            issuedTo : 1
                        }
                    },
                    {
                        "$group": {
                            _id: "$_id",
                            users: { 
                                $addToSet : "$issuedTo" 
                            }
                        }
                    }
                ];
                Models.hardwares.aggregate(pipeline).exec((err,res) => {
                    console.log('-----------------err, res----11111----------',err,res);
                    if(res){
                        cb(null, res)
                    } else {
                        cb(errMsg.noRecords);
                    }
                });
            },

            // Get the employees hardwares repairs total.
            (data,cb) => { 

                const pipeline = [
                    {
                        $group: {
                            _id: "$usedEmpId",
                            total : {$sum: "$repairCost"}
                        }
                    },
                    {
                        $sort: { total: 1 }
                    }
                ];
                Models.repairs.aggregate(pipeline).exec((err,res) => {
                    console.log('-----------------err, res----2222----------',err,res);
                    if(res){
                        cb(null, res)
                    } else {
                        cb(errMsg.noRecords);
                    }
                });
            }

        ], (err, res) => {
            if(err)
                callback(err)
            else
                callback(null, res)
        });
    },





































    // get user details.
    getUserDetails : (request, cb) => Services.users.getUserDetails(request,``, {}, (err, res) => cb(err, res)),

    // Listing all the users.
    listUsers      : (request, cb) => Services.users.listUsers(request,``, {}, (err, res) => cb(err, res))
    
};
