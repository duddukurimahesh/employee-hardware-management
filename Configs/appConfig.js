
/*-----------------------------------------------------------------------
   * @ file        : appConstants.js
   * @ description : Includes all the app settings.
   * @ author      : Duddukuri Mahesh
   * @ date        : 20/09/20147.
-----------------------------------------------------------------------*/

`use strict`;

module.exports = {

    dev              : {
        
        name         : `aviota`,
        host         : `127.0.0.1`,
        port         : `9004`,
        socket       : `9005`,
        absolutePath : `${__dirname}/..`,
        debug        : true
    },

    staging_dev      : {

        name         : ``,
        host         : ``,
        port         : ``,
        socket       : ``,
        absolutePath : `${__dirname}/..`,
        debug        : true
    },

    staging_test     : {

        name         : ``,
        host         : ``,
        port         : ``,
        socket       : ``,
        absolutePath : `${__dirname}/..`,
        debug        : true
    },

    live             : {

        name         : ``,
        host         : ``,
        port         : ``,
        socket       : ``,
        absolutePath : `${__dirname}/..`,
        debug        : false
    }

};

