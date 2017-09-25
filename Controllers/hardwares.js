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
const errMsg   = Utils.error_res;
const succMsg  = Utils.success_res;
const Services = require(`../Services`);
const Models   = require('../Models');

module.exports = {

	// Create hardware and assign to the employee.
  createHardware : (request, cb) => Services.hardwares.createHardware(request, (err, res) => cb(err, res)),

  // Get Hardware list assigned to particulkar Employee.
  getUserHardware: (request, cb) => Services.hardwares.getUserHardware(request, {},{}, (err, res) => cb(err, res)),

  // Edit Hardware details.
  editHardware   : (request, cb) => {

    const queryObj = { hardwareId: request.hardwareId };
    const updateObj= { 
      hardwareName : request.hardwareName,
      originalPrice: request.originalPrice
    };
    const options  = { multi: true };

    Models.hardwares.update(queryObj, updateObj, options).exec((err,res) => {
        if(res){
          cb(null, {statusCode: 200, status:`success`, message: `Hardware record updated successfully.`})
        } else{
          cb(errMsg.systemError)
        }
    });
  },

  // Get hardwares list.
  hardwareList   : cb => {

    const pipeline = [
      {                                 // Get hardwares not deleted.
        $match : { isDeleted: false }
      },
      {
        "$project" : {                  // Select only required fields.
          hardwareId   : 1,
          hardwareName : 1,
          originalPrice: 1,
          issuedAt     : 1
        }
      }
    ];
    Models.hardwares.aggregate(pipeline).exec((err,res) => {
        if(res){
          cb(null, {statusCode: 200, status:`success`, message: `Hardware records fetched successfully.`, data: res})
        } else{
          cb(errMsg.systemError)
        }
    });
  },

  // Assign hardware to new emp and getback from previous emp.
  assignHardware : (request, callback) => {

    async.waterfall([

      // Update the hardware previous emp record("returnedAt" field).
      cb => { 

          const queryObj = {
              hardwareId: request.hardwareId,
              //returnedAt : { $exists: false }
          };
          const updateObj = {
              returnedAt: Date.now()
          };

          Models.hardwares.findOneAndUpdate(queryObj, updateObj, {new: true}).exec((err,res) => {
              if(res){
                cb(null, res)
              } else{
                cb(errMsg.systemError)
              }
          });
      },

      // Assign hardware to new emp.
      (data,cb) => { 

         let saveObj = {
              hardwareId   : request.hardwareId,
              hardwareName : data.hardwareName,
              originalPrice: data.originalPrice,
              issuedTo     : request.issuedTo
          };
          Services.hardwares.createHardware(saveObj, (err, res) => cb(err, res))
      }

    ],callback);
  },


};
