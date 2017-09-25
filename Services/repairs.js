
/*-----------------------------------------------------------------------
   * @ file        : repairs.js
   * @ description : This is the repairs service which will handle the repairs CRUD.
   * @ author      : Duddukuri Mahesh
   * @ date        : 20/09/2017.
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

    // Save new RepairRecord in DB.
    createRepairRecord : (saveObj, cb) => Models.repairs(saveObj).save((err, res) => {
        if(err) {
            if (err.name == `CastError` && err.path == `_id`) return cb((errMsg.provideValidField(`vehicle id`)));
            else return  cb(errMsg.systemError)
        }
        return cb(null,succMsg.repairAddedSuccessfully)
    }),

    // Get Repairs list based on Hardware Id and Employee Id.
    getRepairsList: (queryObj, cb) => Models.repairs.find(queryObj).exec( (err, res) => {
        if(err) {
            return cb(errMsg.systemError)
        }
        return cb(null, succMsg.UserHWRepairList(res))
    }),

    // Update Repairs record.
    editRepairs: (queryObj, updateObj, options, cb) => Models.repairs.update(queryObj, updateObj, options).exec((err,res) => {
        if(res){
          return cb(null, {statusCode: 200, status:`success`, message: `Repair record updated successfully.`})
        }
        return cb(errMsg.systemError)
    }),
}