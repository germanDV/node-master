/*
 * Primary file for the API
 *
 */

// Dependencies
const cluster = require('cluster');
const os = require('os');
const server = require('./lib/server.js');
const workers = require('./lib/workers.js');
const cli = require('./lib/cli.js');

// Declare the app
const app = {};

// Init function
app.init = (callback) => {
    if(cluster.isMaster){
        // Start workers
        workers.init();

        // Start CLI, but make sure it starts last
        setTimeout(() => {
            cli.init();
            callback();
        }, 50);

        // Fork the process
        for(let i = 0; i < os.cpus().length; i++){
            // This will execute the whole file again
            cluster.fork();
        }
    } else{
        // If not on master thread, start server (fork it)
        server.init();
    }
};

// Self-invoking only if this file is invoked directly
// The callback is just for convenience when testing
if(require.main === module){
    app.init(() => {});
}

// Export the app
module.exports = app;