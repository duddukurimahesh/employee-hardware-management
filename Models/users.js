
/*-----------------------------------------------------------------------
   * @ file        : users.js
   * @ description : This file defines the user schema for mongodb.
   * @ author      : Duddukuri Mahesh
   * @ date        : 19/09/2017.
-----------------------------------------------------------------------*/

`use strict`;

/*--------------------------------------------
    * Include internal and external modules.
---------------------------------------------*/
const Mongoose     = require (`mongoose`);
const autopopulate = require(`mongoose-autopopulate`);
const AutoIncrement= require('mongoose-sequence');
const Schema       = Mongoose.Schema;
const env          = require(`../env`);

if (env.instance == "dev") {
    Mongoose.set(`debug`, true);  // Console mongo queries in dev env.
}

let UsersSchema = new Schema({     // User Schema.

    role         : { type: Number, enum: [0,1], default:1 },  // 0- Admin, 1- Employee.
    empId        : { type: String, trim: true, unique: true, index:true, sparse:true, required: true },          // comp employee id.
    name         : { type: String, required: true },
    accessToken  : { type: String },
    email        : { type: String, trim: true, unique: true, index:true, sparse:true, required: true },
    password     : { type: String, required: true },
    createdAt    : { type: Date, default: Date.now },
    modifiedAt   : { type: Date },
    isSuspended  : { type: Boolean, default: false },
    isDeleted    : { type: Boolean, default: false },
    isConfirmed  : { type: Boolean, default: true }           // for testing purpose default is true otherwise false.

});

UsersSchema.plugin(AutoIncrement, { inc_field: 'userCnt' });
let users = Mongoose.model (`users`, UsersSchema);
module.exports = users;
