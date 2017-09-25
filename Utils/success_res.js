 /*------------------------------------------------------------------------------------
   * @ file        : success_res.js
   * @ description : Here define all the success responses used in the application.
   * @ author      : Duddukuri Mahesh
   * @ date        : 20/09/2017.
-------------------------------------------------------------------------------------*/

module.exports = {

    /*------------------------------------------
              User Success responses
    ------------------------------------------*/
    UserRegisterSuccessfully: res => {
      return {
          statusCode : 200,
          status     : `success`,
          message    : `New account has been registered successfully.`,
          data       : res
      }
    },

    loOut: {
          statusCode : 200,
          status     : `success`,
          message    : `LogOut successfully.`
    },

    profileUpdated: res => {
      return {
          statusCode : 200,
          status     : `success`,
          message    : `Profile Updated successfully.`,
          data       : res
      }
    },

    listingEmp: res => {
      return {
          statusCode : 200,
          status     : `success`,
          message    : `Employees list fetched successfully.`,
          data       : res
      }
    },


    /*------------------------------------------
            Hardware Success responses
    ------------------------------------------*/

    hardwareSavedSuccessfully: res => {
      return {
          statusCode : 200,
          status     : `success`,
          message    : `Hardware added and assigned successfully.`,
          data       : res
      }
    },

    UserHardwareList: res => {
      return {
          statusCode : 200,
          status     : `success`,
          message    : `User assigned hardwares list fetched successfully.`,
          data       : res
      }
    },

    /*------------------------------------------
            Hardware Success responses
    ------------------------------------------*/

    repairAddedSuccessfully: {
        statusCode : 200,
        status     : `success`,
        message    : `Repair record added successfully.`
    },

    UserHWRepairList: res => {
      return {
          statusCode : 200,
          status     : `success`,
          message    : `Hardwares repairs list fetched successfully.`,
          data       : res
      }
    },
}