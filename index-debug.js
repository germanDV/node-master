/*
 * Primary file for API
 *
 */

// Run "$ node inspect index-debug.js" to start debugging
// Some debug available commands: cont, next, in, out, repl

// Dependencies
const server = require('./lib/server');
const workers = require('./lib/workers');
const exampleDebuggingProblem = require('./lib/exampleDebuggingProblem');
const cli = require('./lib/cli');

// Declare the app
const app = {};

// Init function
app.init = () => {
    // Start the server
    debugger;
    server.init();
    debugger;

    // Start the workers
    debugger;
    workers.init();
    debugger;

    // Start the CLI, but make sure it starts last
    debugger;
    setTimeout(() => {
        cli.init();
        debugger;
    }, 50);
    debugger;

    // Start an example script that has issues (throws an error)
    debugger;
    // Set foo at 1
    var foo = 1;
    console.log("Just assigned 1 to foo");
    debugger;

    // Increment foo
    foo++;
    console.log("Just incremented foo");
    debugger;

    // Square foo
    foo *= foo;
    console.log("Just multipled foo by itself");
    debugger;

    // Convert foo to a string
    foo = foo.toString();
    console.log("Just changed foo to a string");
    debugger;

    // Call the init script that will throw
    exampleDebuggingProblem.init();
    debugger;
};

// Self executing
app.init();

// Export the app
module.exports = app;
