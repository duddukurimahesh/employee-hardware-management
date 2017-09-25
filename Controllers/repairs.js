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

	// create a new repair record.
	createRepair: (request, cb) => Services.repairs.createRepairRecord(request, (err, res) => cb(err, res)),

	// Get Repairs list based on Hardware Id and Employee Id.
	getRepairsList: (request, cb) => Services.repairs.getRepairsList(request, (err, res) => cb(err, res)),

	// Edit Repairs.
	editRepairs : (request, cb) => {
		
		const queryObj= { _id : request._id };
		let updateObj = {};
		if(request.repairDesc){
			updateObj.repairDesc = request.repairDesc;
		} else if(request.repairCost){
			updateObj.repairCost = request.repairCost;
		} else if(request.isDeleted){
			updateObj.isDeleted = request.isDeleted;
		}
		Services.repairs.editRepairs(queryObj, updateObj, {}, (err, res) => cb(err, res))
	}
};
