 
/*-----------------------------------------------------------------------
   * @ file        : index.js
   * @ description : Main module to incluse all the Routes.
   * @ author      : Duddukuri Mahesh
   * @ date        : 20/09/2017.
-----------------------------------------------------------------------*/

`use strict`;

const users     = require(`./users`);
const hardwares = require(`./hardwares`);
const repairs   = require(`./repairs`);

module.exports = [].concat(users,hardwares,repairs);
