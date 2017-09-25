
/*------------------------------------------------------------------------
   * @ file        : logger.js
   * @ description : Here define the logger functions.
   * @ author      : Duddukuri Mahesh
   * @ date        : 20/09/2017.
------------------------------------------------------------------------*/

const chalk = require('chalk');
const log   = console.log;

module.exports = {

	err_log    : (err_msg, data) => log(chalk.redBright.bold(`START--------------------------ERROR----------------------------------------------------------\n\t\tError At   : ${err_msg}\n\t\tError Data : ${JSON.stringify(data)}\n-------------------------------------------------------------------------------------------END.`)),
	succ_log   : (succ_msg, data) => log(chalk.blue(`START-----------------------------SUCCESS-----------------------------------------------------\n\t\tSuccess At   : ${succ_msg}\n\t\tSuccess Data : ${JSON.stringify(data)}\n-------------------------------------------------------------------------------------------END.`)),
	plugIn_log : pluginName => log(chalk.magentaBright.bold(`START--------------------------CUSTOM PLUGIN--------------------------------------------------\n\t\tCUSTOM PLUGIN   : ${pluginName}\n-------------------------------------------------------------------------------------------END.`))
	
}
