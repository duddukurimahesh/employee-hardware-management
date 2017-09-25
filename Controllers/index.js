
/*-----------------------------------------------------------------------
   * @ file        : index.js
   * @ description : Main module to incluse all the controllers.
   * @ author      : Duddukuri Mahesh
   * @ date        : 20/09/2017.
-----------------------------------------------------------------------*/

`use strict`;

module.exports = {

    users     : require(`./users`),
    hardwares : require(`./hardwares`),
    repairs   : require(`./repairs`)

};
