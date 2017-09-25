
/*-----------------------------------------------------------------------
   * @ file        : users.js
   * @ description : Here defines all users routes.
   * @ author      : Duddukuri Mahesh
   * @ date        : 20/09/2017.
-----------------------------------------------------------------------*/

`use strict`;

// Include internal and external modules.

const Joi         = require(`joi`);
const Controllers = require(`../Controllers`);
const Utils       = require(`../Utils`);

module.exports = [

    // register a new user ( Admin (or) Employeer ) for admin access only.
    {
        method: `POST`,
        path: `/v1/Users/register`,
        config: {
            description: `Api service used to register a new user .`,
            notes: `<br/>The request object should contain following fields in its <b>Payload/Body</b> object<br/>&bull; <b>role</b>: Which defines the user type. It should contain <b>0</b> or <b>1</b> values. <b>0</b> for <b>Admin</b> and <b>1</b> for <b>Employee</b>.<br/>&bull; <b>name</b>: Should carry the name of the user with not more than 30 characters. <br/>&bull; <b>email</b>: The email of the user on which he/she will recieve an OTP for Verification(send email not implemented) and for further login.<br/>&bull; <b>Password</b>: Should carry an alpha numeric password for the user account.<br/><br/>. `,
            tags: [`api`],
            pre: [{ method: Utils.universal_fns.require_login, assign: `verify` }], // middleware to verify logintoken before proceeding.
            validate: {
                headers: Joi.object({
                    'x-logintoken': Joi.string().trim().required()
                }).options({allowUnknown: true}),
                payload: {
                    role     : Joi.number().required().valid(0, 1),  // 0- Admin, 1- Employee.
                    name     : Joi.string().regex(/^([a-zA-Z_ ]){1,30}$/).options({ language: { string: { regex: { base: "should be valid name with maximum 30 characters" } } } }).trim().required().label(`Name`),
                    email    : Joi.string().email().lowercase().required().label(`Email`),
                    password : Joi.string().regex(/^(?=.*\d)(?=.*[a-zA-Z])[0-9a-zA-Z]{6,16}$/).options({ language: { string: { regex: { base: `must be alphanumeric` } } } }).required().label(`Password`)
                },
                failAction: Utils.universal_fns.failActionFunction
            }
        },
        handler: (request, reply) => {
            if(request.pre.verify.data.role == 0){   // check user is admin or not.
                Controllers.users.register(request.payload, (err, res) => reply(err, res))
            } else {
                reply(Utils.error_res.unAuthAccess)
            }
        }
    },

    // Api to logIn users.
    {
        method: `PUT`,
        path: `/v1/Users/login`,
        config: {
            description: `Api service used for logging into the app.`,
            notes: `The request object should contain following fields in its <b>Payload/Body</b> object<br/>&bull; <b>email</b>: The email of the user used while creating the account.<br/>&bull; <b>Password</b>: Should carry an alpha numeric password for the user account.`,
            tags: [`api`],
            validate: {
                payload: {
                    email   : Joi.string().email().lowercase().required().label(`Email`),
                    password: Joi.string().regex(/^(?=.*\d)(?=.*[a-zA-Z])[0-9a-zA-Z]{6,16}$/).options({ language: { string: { regex: { base: `must be alphanumeric` } } } }).required().label(`Password`)
                }
            }
        },
        handler: (request, reply) => {
            Controllers.users.login(request.payload, (err, res) => {
                if (err)
                    reply(err);
                else{
                    var response = {statusCode: 200, ststus: `success`, message: `User logged in successfully.`};
                    response.result = res.user_data;
                    reply(response).header('x-logintoken', res.login_token);
                }
            });
        }
    },

    // Update User profile.
    {
        method: `PUT`,
        path: `/v1/Users/updateProfile`,
        config: {
            description: `Api service used for update user profile.`,
            notes: `Api service used for update user profile.`,
            tags: [`api`],
            pre: [{ method: Utils.universal_fns.require_login, assign: `verify` }],
            validate: {
                headers: Joi.object({
                    'x-logintoken': Joi.string().trim().required()
                }).options({allowUnknown: true}),
                payload: {
                    _id   : Joi.string().regex(/^[a-f\d]{24}$/i).options({ language: { string: { regex: { base: `should be valid` } } } }).required().label(`Employee Id`),
                    name  : Joi.string().regex(/^([a-zA-Z_ ]){1,30}$/).options({ language: { string: { regex: { base: "should be valid name with maximum 30 characters" } } } }).trim().required().label(`Name`),
                    email : Joi.string().email().lowercase().required().label(`Email`)
                },
                failAction: Utils.universal_fns.failActionFunction
            }
        },
        handler: (request, reply) => {
            let data = {
                payload: request.payload, 
                preData: request.pre.verify.data
            };
            Controllers.users.updateProfile(data, (err, res) => reply(err, res))
        }
    },

    // Get all users list.
    {
        method: `GET`,
        path: `/v1/Users/getEmp`,
        config: {
            description: `Api service used to get the employees list.`,
            notes: `Api service used to get the employees list.`,
            tags: [`api`],
            pre: [{ method: Utils.universal_fns.require_login, assign: `verify` }],
            validate: {
                headers: Joi.object({
                    'x-logintoken': Joi.string().trim().required()
                }).options({allowUnknown: true}),
                failAction: Utils.universal_fns.failActionFunction
            }
        },
        handler: (request, reply) => {
            if(request.pre.verify.data.role == 0){   // check user is admin or not.
                Controllers.users.listUsers(request.params, (err, res) => reply(err, res))
            } else {
                reply(Utils.error_res.unAuthAccess)
            }
        }
    },

    // Api to logOut users.
    {
        method: `PUT`,
        path: `/v1/Users/logOut`,
        config: {
            description: `Api service used to get the employees list.`,
            notes: `Api service used to get the employees list.`,
            tags: [`api`],
            pre: [{ method: Utils.universal_fns.require_login, assign: `verify` }],
            validate: {
                headers: Joi.object({
                    'x-logintoken': Joi.string().trim().required()
                }).options({allowUnknown: true}),
                failAction: Utils.universal_fns.failActionFunction
            }
        },
        handler: (request, reply) => {
            Controllers.users.logOut(request.pre.verify.data, (err, res) => reply(err, res))
        }
    },

    // Api to finding the best employee in terms of maintaining hardware.
    {
       method: `GET`,
        path: `/v1/Users/bestEmp`,
        config: {
            description: `Api service used to get the best employee in terms of maintaining hardware.`,
            notes: `Api service used to get the best employee in terms of maintaining hardware.`,
            tags: [`api`],
            pre: [{ method: Utils.universal_fns.require_login, assign: `verify` }],
            validate: {
                headers: Joi.object({
                    'x-logintoken': Joi.string().trim().required()
                }).options({allowUnknown: true}),
                failAction: Utils.universal_fns.failActionFunction
            }
        },
        handler: (request, reply) => {
            if(request.pre.verify.data.role == 0){   // check user is admin or not.
                Controllers.users.bestEmp((err, res) => reply(err, res))
            } else {
                reply(Utils.error_res.unAuthAccess)
            }
        } 
    }









































    // Get particular user details.
    /*{
        method: `GET`,
        path: `/v1/Users/getUser/{_id}`,
        config: {
            description: `Api service used to get the user details.`,
            notes: `get user detailss`,
            tags: [`api`],
            validate: {
                params: {
                    _id : Joi.string().regex(/^[a-f\d]{24}$/i).options({ language: { string: { regex: { base: `should be valid` } } } }).required().label(`user id`),
                }
            }
        },
        handler: (request, reply) => Controllers.users.getUserDetails(request.params, (err, res) => reply(err, res))
    }*/
	
];