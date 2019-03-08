/*
 * Primary file for API
 *
 */

// Run with "$ node --use_strict index-strict.js"

// Dependencies
const server = require('./lib/server');
const workers = require('./lib/workers');
const cli = require('./lib/cli');

// Declare the app
const app = {};

// Declaring a global (strict should catch this mistake)
foo = 'bar';

// Init function
app.init = () => {
    // Start the server
    server.init();

    // Start the workers
    workers.init();

    // Start the CLI, but make sure it starts last
    setTimeout(() => cli.init(), 50);
};

// Self executing
app.init();

// Export the app
module.exports = app;
