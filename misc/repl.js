/*
 * Example REPL
 *
 */

// Dependencies
const repl = require('repl');

// Start the REPL
repl.start({
    prompt: '> ',
    eval: (str) => {
        console.log(`At the evaluation of: ${str}`);
        if(str.indexOf('fizz') > -1){
            console.log('buzz');
        }
    },
});