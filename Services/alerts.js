
/*-----------------------------------------------------------------------
   * @ file        : alerts.js
   * @ description : This is the alerts service which will handle the alerts CRUD.
   * @ author      : Duddukuri Mahesh
   * @ date        : 
-----------------------------------------------------------------------*/

/*--------------------------------------------
    * Include internal and external modules.
---------------------------------------------*/
`use strict`;

const async  = require('async');
const jwt    = require('jsonwebtoken');

const Models = require('../Models');
const Utils  = require('../Utils');

module.exports = {

	// register new user.
    createNewAlert : (params, callback) => {

        async.waterfall(
            [

                cb => {           // Function to save the Alerts Notification Object in DB.

                    var saveObj = {

                        "notif_msg.text" : params.text,
                        url              : params.url || "",
                        isProfileSpecific: params.isProfileSpecific || false,
                        profileId        : params.profileId || "",
                        "resource_context.resourceId" : params.resourceId,
                        "resource_context.resouceType": params.resouceType,
                        notif_type       : params.notif_type,
                        "from.userId"    : params.from_userId,
                        "from.userName"  : params.from_userName,
                        "to.userId"      : params.to_userId,
                        "to.userName"    : params.to_userName,
                        createdBy        : params.createdBy
                    };

                    Utils.universal_fns.saveQry(Models.alerts, saveObj, (err, res) => cb(err, Utils.success_res.saveNotificationAndSendRes(res)));
                }

            ]
        ,callback);
    },

    // Update alert read status.
    updateNotifyStatus : (params, callback) => {

        async.waterfall(
            [

                cb => {           // check the user is auth or not to do this action.

                    let queryObj = {
                        _id         : params.alert_id,
                        "to.userId" : params.updatedBy
                    };
                    Utils.universal_fns.findOneQry(Models.alerts, queryObj, {}, {}, (err, res) => {
                        if(err) {
                            cb(err);
                        } else if(res){
                            cb(null, params)
                        } else {
                            cb(Utils.error_res.unAuthAccess);
                        }
                    });
                },

                (data, cb) => {   // Update the read status of Alert Notification Object.

                    let queryObj = {
                        _id : params.alert_id
                    };
                    let updateObj = {
                        
                        updatedAt : new Date().toISOString(),
                        updatedBy : params.updatedBy
                    };

                    if(params.mode == 1){
                        updateObj.isRead = true;
                    } else {
                        updateObj.isDeleted = true;
                    };

                    Utils.universal_fns.updateOneAndgetUpdatedDataQry(Models.alerts, queryObj, updateObj,{ new:true }, (err, res) => cb(err, Utils.success_res.notifyUpdate(res) ));
                }

            ]
        ,callback);
    },

    // fetch user Notifications.
    getUserAlerts : (params, callback) => {

        async.waterfall(
            [
                cb => {           // Fetch the user Notifications list.

                    let queryObj = {
                        //"to.userId" : params.userId
                    };
                    let projection = '_id url notif_type to.userId createdBy';

                    Utils.universal_fns.findQry(Models.alerts, queryObj, projection,{}, (err, res) => callback(err, { statusCode: 200, status: 'success', message: 'Notifications fetched successfully.', data: res }));
                }

            ]
        ,callback);
    },

    // fetch the Notifications with servier side pagination.
    fetchNotifiPagination : (params, callback) => {

        params.obj1 = {             
            $match :{ $and: [
                { isDeleted   : false },
                { "to.userId" : params.userId }
            ]}
        };

        if(params.profileId) {    // if profile Id is given.

            params.obj2 = {
                $match : {
                    $or : [
                        { isProfileSpecific : false },
                        { isProfileSpecific : true, profileId : params.profileId }
                    ]
                }
            };

        } else {                  // if profile Id not provided.

            params.obj2 = {
                $match : { isProfileSpecific : true }
            };
        };

        async.waterfall(
            [

                cb => {           // show the total number of notifications first time.
                    if(params.pageNum == 1) {   

                        Utils.universal_fns.aggregate(Models.alerts, [params.obj1, params.obj2],(err,res)=> {
                            if(err) {
                                cb(Utils.error_res.systemError)
                            } else {
                                params.totalCnt = res.length;
                                cb(null, params);
                            }
                        });
                    } else {
                        cb(null, params);
                    };
                },

                (data, cb) => {   // Fetch the user Notifications list with server side pagination.

                    let pipeline =[

                        params.obj1,                         // select records based on the to user Id and isDeleted fields.
                        params.obj2,                         // select records based on profilr id logic.
                        { 
                            "$sort": { createdAt : 1 }       // sort based on created date.
                        },
                        { 
                            "$skip": (params.pageNum*50)-50  // skip the records based on page num.
                        },
                        { 
                            "$limit": 50                     // default resrecords are 50.
                        },
                        {                                    // get only required fields.
                            "$project" : 
                            {
                                _id       : 1,
                                notif_msg : 1,
                                from      : 1,
                                to        : 1,
                                createdAt : 1,
                                createdBy : 1,
                                notif_type: 1
                            }
                        }
                    ];

                    Utils.universal_fns.aggregate(Models.Alerts, pipeline, (err, res) => {
                        if(err) {
                            cb(Utils.error_res.systemError);
                        } else {
                            if(params.pageNum == 1){
                                var result = {
                                    totalCnt : params.totalCnt,
                                    data     : res
                                };
                            } else {
                                var result = {
                                    data : res
                                };
                            }
                            
                            cb(null, Utils.success_res.fetchNotifications(result));
                        }
                    });
                }

            ]
        ,callback);
    },

    // findOne query.
    findOneQry: (queryObj, projectionQry, options, cb) => Models.users.findOne(queryObj, projectionQry, options).exec( (err, res) => {

        if(err) {
            if(err.name == "CastError" && err.path == "_id" && model.modelName == `alerts`) return cb(` Please provide valid notification id.`);
            return cb(err);
        }
        return cb(null,res);
    }),
};
