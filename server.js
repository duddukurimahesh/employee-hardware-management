
/*---------------------------------------------------------------------------------
   * @ file        : server.js
   * @ description : This is the main startup server file to init the application.
   * @ author      : Duddukuri Mahesh
   * @ date        :
----------------------------------------------------------------------------------*/

`use strict`;

// Include external modules.
const Hapi     = require(`hapi`);
const mongoose = require(`mongoose`);
// Include internal modules.
const plugIns  = require(`./PlugIns`);
const Configs  = require(`./Configs`);
const env      = require(`./env`);
const Utils    = require(`./Utils`);
const app      = Configs.app[env.instance];
const db       = Configs.db [env.instance];
const server   = new Hapi.Server();
const routes   = require(`./Routes`);
const scheduler= require(`./Utils`).scheduler;
const Models   = require(`./Models`);

// creating REST API server connection.
server.connection({
    host: app.host,
    port: app.port,
    routes: {
        cors: {
            origin: [`*`],
            additionalHeaders: [`x-logintoken`],
            additionalExposedHeaders: [`x-logintoken`]
        }
    },
    labels: [`api`]
},{
    timeout:{
        server: 5000
    }
});

const apiServer = server.select(`api`);
Utils.logger.succ_log(`SERVER SETTINGS LOADED`,app);

// configure all routes to server object.
server.route(routes);

// register PlugIn`s and Start the server.
server.register(plugIns,function(err) {
    // something bad happened loading the plugin.
    if (err) {
        throw err;
    }
    // start server after all PlugIns registration.
    server.start(function(err) {
        if (err) {
            Utils.logger.err_log(`Error starting server`,err);
            throw err;
        } else{
            Utils.logger.succ_log(`SERVER STARTED`,app);
        };
    });
});

/* -----  DB connections section.  -----*/
// Connect to MongoDB section.

// DB options.
const Db_Options = {
    db     : { native_parser: true },
    server : { poolSize: 5 },
    user   : db.username,
    pass   : db.password
}; // Build the connection string.
const mongoUrl = `mongodb://`+db.host+`:`+db.port+`/`+db.name;

// create DB connection.
mongoose.connect(mongoUrl,Db_Options,function(err) {
    if (err) {
        Utils.logger.err_log(`DB Error`,err);
        process.exit(1);
    } else{
        Utils.logger.succ_log(`MongoDB Connected`,mongoUrl);
    }
});



/*----------------This is for testing purpose to create Admin account-----------------*/
let adminObj = {
    role    : 0,
    empId   : `AV-1`,
    name    : `admin`,
    email   : `admin@gmail.com`,
    password: `e00cf25ad42683b3df678c61f42c6bda`
};
Models.users.findOne({email:`admin@gmail.com`}).lean().exec((err,res) => {
    if(err || !res){
        Models.users(adminObj).save((err, res) => {
            if(res){
                Utils.logger.succ_log(`Admin Account created`,{ empId: res.empId, email: `admin@gmail.com`, password: `admin1` });
            } else {
                Utils.logger.err_log(`Error while creating the Admin`, ``);
            }
        });
    }
});

/*

--------- for enhancement we can add ---------

1. gulp tasks
2. docker file
3. jenkins configurations
4. test cases
5. eslint configuration
6. socket plugin configuration
7. client side project structure (either Angular.Js ot React.Js)
8. JS Doc configuration , etc...

*/