
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
const Joi         = require(`joi`);

const Controllers = require(`../Controllers`);
const Utils       = require(`../Utils`);

module.exports = [

    // create a new repair record.
    {
        method: `POST`,
        path: `/v1/Repairs/create`,
        config: {
            description: `Api service used to add new repair record.`,
            notes: `Api service used to add new repair record.`,
            tags: [`api`],
            pre: [{ method: Utils.universal_fns.require_login, assign: 'verify' }],
            validate: {
                headers: Joi.object({
                    'x-logintoken': Joi.string().trim().required()
                }).options({allowUnknown: true}),
                payload: {
                    hardwareId : Joi.string().regex(/^[a-f\d]{24}$/i).options({ language: { string: { regex: { base: 'should be valid' } } } }).required().label(`hardware id`),
                    repairCost : Joi.number().required().label(`hardware name`),
                    repairDesc : Joi.string().required().label(`chassis number`),
                    usedEmpId  : Joi.string().regex(/^[a-f\d]{24}$/i).options({ language: { string: { regex: { base: 'should be valid' } } } }).required().label(`employee id`)
                },
                failAction: Utils.universal_fns.failActionFunction
            }
        },
        handler: (request, reply) => {
            if(request.pre.verify.data.role == 0){   // check user is admin or not.
                Controllers.repairs.createRepair(request.payload, (err, res) => reply(err, res))
            } else {
                reply(Utils.error_res.unAuthAccess)
            }
        } 
    },

    // Get Repairs list based on Hardware Id and EmployeeId.
    {
        method: `GET`,
        path: `/v1/Repairs/AssignedList/{hardwareId}/{usedEmpId}`,
        config: {
            description: `Api service used to get Hardware list based on Hardware Id.`,
            notes: `Api service used to get Hardware list based on Hardware Id.`,
            tags: [`api`],
            pre: [{ method: Utils.universal_fns.require_login, assign: 'verify' }],
            validate: {
                headers: Joi.object({
                    'x-logintoken': Joi.string().trim().required()
                }).options({allowUnknown: true}),
                params: {
                    hardwareId: Joi.string().regex(/^[a-f\d]{24}$/i).options({ language: { string: { regex: { base: 'should be valid' } } } }).required().label(`Hardware Id`),
                    usedEmpId : Joi.string().regex(/^[a-f\d]{24}$/i).options({ language: { string: { regex: { base: 'should be valid' } } } }).required().label(`employee id`)
                },
                failAction: Utils.universal_fns.failActionFunction
            }
        },
        handler: (request, reply) => {
                Controllers.repairs.getRepairsList(request.params, (err, res) => reply(err, res))
        } 
    },

    // Update Hardware details.
    {
        method: `PUT`,
        path: `/v1/Repairs/update`,
        config: {
            description: `Api service used to edit repairs details.`,
            notes: `Api service used to edit repairs details.`,
            tags: [`api`],
            pre: [{ method: Utils.universal_fns.require_login, assign: 'verify' }],
            validate: {
                headers: Joi.object({
                    'x-logintoken': Joi.string().trim().required()
                }).options({allowUnknown: true}),
                payload: {
                    _id        : Joi.string().regex(/^[a-f\d]{24}$/i).options({ language: { string: { regex: { base: 'should be valid' } } } }).required().label(`Hardware Id`),
                    repairDesc : Joi.string().label(`Repair description`),
                    repairCost : Joi.number().label(`Repair price`),
                    isDeleted  : Joi.boolean()
                },
                failAction: Utils.universal_fns.failActionFunction
            }
        },
        handler: (request, reply) => {
            if(request.pre.verify.data.role == 0){   // check user is admin or not.
                Controllers.repairs.editRepairs(request.payload, (err, res) => reply(err, res))
            } else {
                reply(Utils.error_res.unAuthAccess)
            }
        } 
    }

];