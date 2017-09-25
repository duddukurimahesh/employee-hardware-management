
/*-----------------------------------------------------------------------
   * @ file        : hardwares.js
   * @ description : This file defines the hardwares issued record schema for mongodb.
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

let hardwareSchema = new Schema({     // Hardware Schema.

    hardwareId    : { type: String, trim: true, required: true },
    hardwareName  : { type: String, trim: true, required: true },
    originalPrice : { type: Number, required: true },
    issuedTo      : { type: Schema.Types.ObjectId, ref:`users`,index:true,sparse:true,required: true /*autopopulate: { select: 'name' }*/ },
    issuedAt      : { type: Date, default: Date.now },
    returnedAt    : { type: Date },
    //issuedBy      : { type: Schema.Types.ObjectId, ref: `users`, index:true, sparse:true, required: true },  // if we have multiple admins, then to recognize which admin issued this hard ware.
    //modifiedBy    : { type: Schema.Types.ObjectId, ref: `users`, index:true, sparse:true },
    modifiedAt    : { type: Date },  
    isDeleted     : { type: Boolean, default: false }

});

hardwareSchema.plugin(autopopulate);
let hardwares = Mongoose.model (`hardwares`, hardwareSchema);
module.exports = hardwares;
