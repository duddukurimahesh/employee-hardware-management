
/*----------------------------------------------------------------------------------
   * @ file        : error_res.js
   * @ description : Here define all the error responses used in the application.
   * @ author      : Duddukuri Mahesh
   * @ date        : 20/09/2017.
----------------------------------------------------------------------------------*/


module.exports = {

    /*------------------------------------------
              Users Error responses
    ------------------------------------------*/

    systemError : {
      statusCode: 500,
      status    : `error`,
      message   : `Technical error ! Please try again later.`
    },

    contactAlreadyExists: {
      statusCode: 103,
      status    : `warning`,
      message   : `This contact number is already registered.`
    },

    unAuthAccess: { 
      statusCode: 105, 
      status    : `warning`, 
      message   : `UnAuthorised access.`
    },

    emailAlreadyExists : {
      statusCode  : 106,
      description :`error`,
      message     : `Email already exists. Please try again with different email address.`
    },

    empIdAlreadyExists : {
      statusCode  : 107,
      description :`error`,
      message     : `Employee Id already exists. Please try again with different employee Id.`
    },

    provideValidField : field => {
      return {
        statusCode  : 108,
        description :`error`,
        message     : `Please provide valid ${field}.`
      }
    },

    userNotFound : {
      statusCode  : 107,
      description :`error`,
      message     : `User not found. Please provide valid credentials.`
    },

    tokenExpired: {
      statusCode: 401,
      status: "warning",
      message: 'Token Expired.'
    },

    suspended: {
      statusCode : 400, 
      status     : `error`, 
      message    : `Your account is suspended.Please contact the admin.`
    },

    

    /*------------------------------------------
              Hardware Error responses
    ------------------------------------------*/

    hardwareIdAlreadyExists: {
      statusCode  : 106,
      description :`error`,
      message     : `Hardware Id already exist.`
    },

    vehicleNotFound       : {
      statusCode  : 107,
      description :`error`,
      message     : `Vehicle not found. Please provide valid credentials.`
    },

    noRecords :  {
      statusCode  : 109,
      description :`error`,
      message     : `No records found.`
    },

};
