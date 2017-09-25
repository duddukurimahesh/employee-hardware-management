
/*-----------------------------------------------------------------------
   * @ file        : repairs.js
   * @ description : This file defines the hardwares repairs schema for mongodb.
   * @ author      : Duddukuri Mahesh
   * @ date        : 19/09/2017.
-----------------------------------------------------------------------*/

`use strict`;

/*--------------------------------------------
    * Include internal and external modules.
---------------------------------------------*/
const Mongoose     = require (`mongoose`);
const autopopulate = require(`mongoose-autopopulate`);
const Schema       = Mongoose.Schema;
const env          = require(`../env`);

if (env.instance == "dev") {
    Mongoose.set(`debug`, true);     // Console mongo queries in dev env.
}

let repairsSchema = new Schema({     // Repairs services Schema.

    repairCost   : { type: Number, required: true },
    repairDesc   : { type: String, required: true },
    hardwareId   : { type: Schema.Types.ObjectId, ref: `hardwares`, required: true },
    usedEmpId    : { type: Schema.Types.ObjectId, ref: `users`, required: true },
    createdAt    : { type: Date, default: Date.now },
    modifiedAt   : { type: Date }, 
    //createdAdmin : { type: Schema.Types.ObjectId, ref: `users`, index:true, sparse:true, required: true },
    //modifiedAdmin: { type: Schema.Types.ObjectId, ref: `users`, index:true, sparse:true }, 
    isDeleted    : { type: Boolean, default: false }

});

let repairs = Mongoose.model (`repairs`, repairsSchema);
module.exports = repairs;
