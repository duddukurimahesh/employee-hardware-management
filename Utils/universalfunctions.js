
/*-----------------------------------------------------------------------
   * @ file        : users.js
   * @ description : Here defines all users routes.
   * @ author      : Duddukuri Mahesh
   * @ date        : 20/09/2017.
-----------------------------------------------------------------------*/

`use strict`;

/*--------------------------------------------
    * Include internal and external modules.
---------------------------------------------*/

// external modules.
const md5   = require(`md5`);
const async = require(`async`);
const jwt   = require(`jsonwebtoken`);
const _     = require(`underscore`);

// internal modules.
const Models    = require(`../Models`);
const Configs   = require('../Configs');
const error_res = require('./error_res.js');

module.exports = {

    // Fail action.
    failActionFunction: (request, reply, source, error) => {
        let customErrorMessage = '';
        if (error.output.payload.message.indexOf("[") > -1) {
            customErrorMessage = error.output.payload.message.substr(error.output.payload.message.indexOf("["));
        } else {
            customErrorMessage = error.output.payload.message;
        }
        customErrorMessage = customErrorMessage.replace(/"/g, '');
        customErrorMessage = customErrorMessage.replace('[', '');
        customErrorMessage = customErrorMessage.replace(']', '');
        error.output.payload.message = customErrorMessage;
        delete error.output.payload.validation
        return reply(error);
    },

    // validate the given token
    require_login: (request, reply) => { 

        var token = (request.payload != null && (request.payload.logintoken)) ? request.payload.logintoken : ((request.params && request.params.logintoken) ? request.params.logintoken : request.headers['x-logintoken']);
        async.waterfall([

            // checking token expiry.
            cb => {
                
                jwt.verify(token, Configs.consts.JWT_KEY, (err, decode) => {
                    if (err) {
                        cb(error_res.tokenExpired)
                    } else {
                        cb(null, decode);
                    }
                })
            },

            // verifying token and respective userid existence in DB.
            (decodedata, cb) => {

                Models.users.findOne({accessToken: token}, (err, res) => {
                    if (err) {
                        cb(error_res.systemError)
                    } else {
                        if (!res) {
                            cb(error_res.tokenExpired);
                        } else {
                            cb(null, {data: res})
                        }
                    }
                })
            }

        ], (err, result) => {
            if (err) {
                reply(err).takeover();
            } else {
                reply(result);
            }

        })
    },

    // Password encryption.
	encryptpassword: (request) => md5(request),

    // jsonParseStringify.
    jsonParseStringify: data => JSON.parse(JSON.stringify(data)),

    // Generate random string.
    generateRandomString : (length) => {
        var data = "";
        var stringkey = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijklmnopqrstuvwxyz";
        for (var i = 0; i < length; i++)
            data += stringkey.charAt(Math.floor(Math.random() * stringkey.length));
        return data;
    },

    /* ---------------------------------------- DB Utils Query fn`s Start ---------------------------------------- */

    // save query.
    saveQry: (model, saveObj, cb) => model(saveObj).save((err, res) => cb(err, res)),

    // find query.
    findQry: (model, queryObj, projectionQry, options, cb) => model.find(queryObj, projectionQry, options).exec( (err, res) => cb(err, res)),

    // findOne query.
    findOneQry: (model, queryObj, projectionQry, options, cb) => model.findOne(queryObj, projectionQry, options).exec( (err, res) => cb(err, res)),

    // Update Query.
    updateQry: (model, queryObj, updateObj, options, cb) => model.update(queryObj, updateObj, options).exec( (err, res) => cb(err, res)),

    // Update one recore and get the updated data Query.
    updateOneAndgetUpdatedDataQry: (model, queryObj, updateObj, options, cb) => model.findOneAndUpdate(queryObj, updateObj, options).exec( (err, res) => cb(err, res)),

    // Aggregation.
    aggregate: (model, groupArr, cb) => model.aggregate(groupArr, (err, res) => cb(err, res)),

    // populate.
    populateModel: (model, query, projectionQuery, options, populateModel, cb) => model.find(query, projectionQuery, options).populate(populateModel).exec((err, res) => cb(err, res)),
    
    // Nested populate.
    getDataDeepPopulateFixed: (model, query, projectionQuery, options, populateModel, nestedModel, cb) => {
        model.find(query, projectionQuery, options).populate(populateModel).exec((err, docs) => {
            if (err) {
                return cb(err, docs);
            }
            model.populate(docs, nestedModel, (err, populatedDocs) => cb(err, populatedDocs));  s// This object should now be populated accordingly.
        });
    },

    /* ---------------------------------------- DB Utils Query fn`s End ------------------------------------------ */
    
};