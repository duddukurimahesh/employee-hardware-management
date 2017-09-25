
/*-----------------------------------------------------------------------
   * @ file        : users.js
   * @ description : This is the user service which will handle the user CRUD.
   * @ author      : Duddukuri Mahesh
   * @ date        :
-----------------------------------------------------------------------*/

/*--------------------------------------------
    * Include internal and external modules.
---------------------------------------------*/

`use strict`;

const jwt     = require('jsonwebtoken');
//const _       = require('underscore');

const Models  = require('../Models');
const Utils   = require('../Utils');
const errMsg  = Utils.error_res;
const succMsg = Utils.success_res;

module.exports = {

    // Save user in DB.
    register : (saveObj, cb) => Models.users(saveObj).save((err, res) => {
        if(err) {
            if (err.name == `CastError` && err.path == `_id`) return cb((errMsg.provideValidField(`user id`)));
            else if (err.code == 11000 && err.message.indexOf(`email_1`) > -1) return  cb(errMsg.emailAlreadyExists);
            else if (err.code == 11000 && err.message.indexOf(`empId_1`) > -1) return  cb(errMsg.empIdAlreadyExists);
            else return  cb(err);
        }
        return cb(null,succMsg.UserRegisterSuccessfully(res));
    }),

    // Update one recore and get the updated data.
    updateOneAndgetUpdatedDataQry: (queryObj, updateObj, options, cb) => Models.users.findOneAndUpdate(queryObj, updateObj, options).exec( (err, res) => {
        if(err) {
            if (err.name == `CastError` && err.path == `_id`) return cb((errMsg.provideValidField(`user id`)));
            else if (err.code == 11000 && err.message.indexOf(`email_1`) > -1) return  cb(errMsg.emailAlreadyExists);
            else return cb(errMsg.systemError);
        }
        return cb(null,succMsg.profileUpdated(res));
    }),

    // Get particular user details.
    getUserDetails: (queryObj, projectionQry, options, cb) => Models.users.findOne(queryObj, projectionQry, options, (err, res) => {

        if(err) {
            if(err.name == `CastError` && err.path == `_id`) return cb(errMsg.provideValidField(`user id`));
            return cb(err);
        } else if(!res) {
            return cb(errMsg.provideValidField(`credentials`))
        } else if (res.is_suspended) {
            return cb(errMsg.suspended)
        } else {
            return cb(null,res);
        };
    }),

    // list all employees in the application.
    listUsers: (queryObj, projectionQry, options, cb) => Models.users.find(queryObj, `empId name email createdAt`, options).exec( (err, res) => {

        if(err) {
            return cb(errMsg.systemError);
        }
        return cb(null, succMsg.listingEmp(res)) ;
    }),


                /* ---------- Extra DB queries on users collection ---------- */


    // Update Query.
    updateQry: (queryObj, updateObj, options, cb) => Models.users.update(queryObj, updateObj, options).exec( (err, res) => cb(err, res)),

    // Aggregation.
    aggregate: (groupArr, cb) => Models.users.aggregate(groupArr, (err, res) => cb(err, res)),

    // populate.
    populateModel: (query, projectionQuery, options, populateModel, cb) => Models.users.find(query, projectionQuery, options).populate(populateModel).exec((err, res) => cb(err, res)),
    
    // Nested populate.
    getDataDeepPopulateFixed: (query, projectionQuery, options, populateModel, nestedModel, cb) => {
        Models.users.find(query, projectionQuery, options).populate(populateModel).exec((err, docs) => {
            if (err) {
                return cb(err, docs);
            }
            Models.users.populate(docs, nestedModel, (err, populatedDocs) => cb(err, populatedDocs));  s// This object should now be populated accordingly.
        });
    }

};
