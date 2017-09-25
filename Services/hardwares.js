
/*-----------------------------------------------------------------------
   * @ file        : hardwares.js
   * @ description : This is the hardwares service which will handle the hardwares CRUD.
   * @ author      : Duddukuri Mahesh
   * @ date        :
-----------------------------------------------------------------------*/

/*--------------------------------------------
    * Include internal and external modules.
---------------------------------------------*/

const async  = require('async');
const jwt    = require('jsonwebtoken');
const path   = require('path')
const fs     = require('fs');
const _      = require('underscore');

const Models  = require('../Models');
const Utils   = require('../Utils');
const errMsg  = Utils.error_res;
const succMsg = Utils.success_res;
const Configs = require('../Configs');
const env     = require('../env');
const logger  = Utils.logger;

module.exports = {

    // Save new hardware in DB.
    createHardware : (saveObj, cb) => Models.hardwares(saveObj).save((err, res) => {
        if(err) {
            if (err.name == `CastError` && err.path == `_id`) return cb((errMsg.provideValidField(`vehicle id`)));
            else if (err.code == 11000 && err.message.indexOf(`hardwareId_1`) > -1) return  cb(errMsg.hardwareIdAlreadyExists);
            else return  cb(errMsg.systemError);
        }
        return cb(null,succMsg.hardwareSavedSuccessfully(res));
    }),

    // Get Hardware list assigned to particulkar Employee.
    getUserHardware: (queryObj, projectionQry, options, cb) => Models.hardwares.find(queryObj, projectionQry, options).exec( (err, res) => {

        if(err) {
            return cb(errMsg.systemError);
        }
        return cb(null, succMsg.UserHardwareList(res)) ;
    })
    
};