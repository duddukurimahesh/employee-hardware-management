
/*-----------------------------------------------------------------------
   * @ file        : users.js
   * @ description : Here defines all Hardwares routes.
   * @ author      : Duddukuri Mahesh
   * @ date        : 20/09/2017.
-----------------------------------------------------------------------*/

`use strict`;

// Include internal and external modules.
const Joi         = require(`joi`);
const Controllers = require(`../Controllers`);
const Utils       = require(`../Utils`);

module.exports = [

    // create a new hardware.
    {
        method: `POST`,
        path: `/v1/Hardware/create`,
        config: {
            description: `Api service used to add new hardware and assign to user.`,
            notes: `Api service used to add new hardware and assign to user.`,
            tags: [`api`],
            pre: [{ method: Utils.universal_fns.require_login, assign: 'verify' }],
            validate: {
                headers: Joi.object({
                    'x-logintoken': Joi.string().trim().required()
                }).options({allowUnknown: true}),
                payload: {
                    hardwareId    : Joi.string().required().label(`hardware id`),
                    hardwareName  : Joi.string().trim().required().label(`hardware name`),
                    originalPrice : Joi.number().required().label(`Original price`),
                    issuedTo      : Joi.string().regex(/^[a-f\d]{24}$/i).options({ language: { string: { regex: { base: 'should be valid' } } } }).required().label(`employee id`)
                },
                failAction: Utils.universal_fns.failActionFunction
            }
        },
        handler: (request, reply) => {
            if(request.pre.verify.data.role == 0){   // check user is admin or not.
                Controllers.hardwares.createHardware(request.payload, (err, res) => reply(err, res))
            } else {
                reply(Utils.error_res.unAuthAccess)
            }
        } 
    },

    // Get Hardware list assigned to particular Employee.
    {
        method: `GET`,
        path: `/v1/Hardware/AssignedList/{issuedTo}`,
        config: {
            description: `Api service used to get hardwares list assigned to particular employee.`,
            notes: `Api service used to get hardwares list assigned to particular employee.`,
            tags: [`api`],
            pre: [{ method: Utils.universal_fns.require_login, assign: 'verify' }],
            validate: {
                headers: Joi.object({
                    'x-logintoken': Joi.string().trim().required()
                }).options({allowUnknown: true}),
                params: {
                    issuedTo: Joi.string().regex(/^[a-f\d]{24}$/i).options({ language: { string: { regex: { base: 'should be valid' } } } }).required().label(`employee id`)
                },
                failAction: Utils.universal_fns.failActionFunction
            }
        },
        handler: (request, reply) => {
                Controllers.hardwares.getUserHardware(request.params, (err, res) => reply(err, res))
        } 
    },

    // Update Hardware details.
    {
        method: `PUT`,
        path: `/v1/Hardware/update`,
        config: {
            description: `Api service used to edit hardware details.`,
            notes: `Api service used to edit hardware details.`,
            tags: [`api`],
            pre: [{ method: Utils.universal_fns.require_login, assign: 'verify' }],
            validate: {
                headers: Joi.object({
                    'x-logintoken': Joi.string().trim().required()
                }).options({allowUnknown: true}),
                payload: {
                    hardwareId   : Joi.string().required().label(`hardware id`),
                    hardwareName : Joi.string().required().label(`hardware id`),
                    originalPrice: Joi.number().required().label(`Hardware price`)
                },
                failAction: Utils.universal_fns.failActionFunction
            }
        },
        handler: (request, reply) => {
            if(request.pre.verify.data.role == 0){   // check user is admin or not.
                Controllers.hardwares.editHardware(request.payload, (err, res) => reply(err, res))
            } else {
                reply(Utils.error_res.unAuthAccess)
            }
        } 
    },


    // Get Hardwares list.
    {
        method: `GET`,
        path: `/v1/Hardware/list`,
        config: {
            description: `Api service used to get hardwares list.`,
            notes: `Api service used to get hardwares list.`,
            tags: [`api`],
            pre: [{ method: Utils.universal_fns.require_login, assign: 'verify' }],
            validate: {
                headers: Joi.object({
                    'x-logintoken': Joi.string().trim().required()
                }).options({allowUnknown: true}),
                params: {},
                failAction: Utils.universal_fns.failActionFunction
            }
        },
        handler: (request, reply) => {
            if(request.pre.verify.data.role == 0){   // check user is admin or not.
                Controllers.hardwares.hardwareList((err, res) => reply(err, res))
            } else {
                reply(Utils.error_res.unAuthAccess)
            }
        } 
    },

    // Assign hardware to new emp and getback from previous emp.
    {
        method: `POST`,
        path: `/v1/Hardware/assignHardware`,
        config: {
            description: `Api service used to add assign hardware to new emp and getback from previous emp.`,
            notes: `Api service used to add assign hardware to new emp and getback from previous emp.`,
            tags: [`api`],
            pre: [{ method: Utils.universal_fns.require_login, assign: 'verify' }], // middleware to verify logintoken before proceeding.
            validate: {
                headers: Joi.object({
                    'x-logintoken': Joi.string().trim().required()
                }).options({allowUnknown: true}),
                payload: {
                    hardwareId : Joi.string().required().label(`hardware id`),
                    issuedTo   : Joi.string().regex(/^[a-f\d]{24}$/i).options({ language: { string: { regex: { base: 'should be valid' } } } }).required().label(`employee id`)
                },
                failAction: Utils.universal_fns.failActionFunction
            }
        },
        handler: (request, reply) => {
            if(request.pre.verify.data.role == 0){   // check user is admin or not.
                Controllers.hardwares.assignHardware(request.payload, (err, res) => reply(err, res))
            } else {
                reply(Utils.error_res.unAuthAccess)
            }
        } 
    },


];