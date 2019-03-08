/*
 * Primary file for the API
 *
 */

// Dependencies
const server = require('./lib/server.js');
const workers = require('./lib/workers.js');
const cli = require('./lib/cli.js');

// Declare the app
const app = {};

// Init function
app.init = (callback) => {
    // Start server
    server.init();

    // Start workers
    workers.init();

    // Start CLI, but make sure it starts last
    setTimeout(() => {
        cli.init();
        callback();
    }, 50);
};

// Self-invoking only if this file is invoked directly
// The callback is just for convenience when testing
if(require.main === module){
    app.init(() => {});
}

// Export the app
module.exports = app;