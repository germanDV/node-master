/*
 * Test runner
 *
 */

// Dependencies
const unitTests = require('./unit.js');
const apiTests = require('./api.js');

// App logic for test runner
const _app = {};

// Container for the tests
_app.tests = {};

// Add unit tests
_app.tests.unit = unitTests;

// Add api tests
_app.tests.api = apiTests;

// Count all the tests
_app.countTests = () => {
    let counter = 0;

    for(const key in _app.tests){
        if(_app.tests.hasOwnProperty(key)){
            const subTests = _app.tests[key];

            for(const testName in subTests){
                if(subTests.hasOwnProperty(testName)){
                    counter++;
                }
            }
        }
    }

    return counter;
};

// Function to run tests and collect results
_app.runTests = () => {
    const errors = [];
    let successes = 0; const limit = _app.countTests();
    let counter = 0;

    for(const key in _app.tests){
        if(_app.tests.hasOwnProperty(key)){
            const subTests = _app.tests[key];
            for(const testName in subTests){
                if(subTests.hasOwnProperty(testName)){
                    (function(){
                        const tmpTestName = testName;
                        const testValue = subTests[testName];

                        try{
                            testValue(() => {
                                console.log('\x1b[32m%s\x1b[0m', tmpTestName);
                                counter++;
                                successes++;
                                if(counter === limit){
                                    _app.produceTestReport(limit, successes, errors);
                                }
                            });
                        } catch(e){
                            errors.push({
                                name: tmpTestName,
                                error: e,
                            });
                            console.log('\x1b[31m%s\x1b[0m', tmpTestName);
                            counter++;
                            if(counter === limit){
                                _app.produceTestReport(limit, successes, errors);
                            }
                        }
                    })();
                }
            }
        }
    }
};

// Produce a test outcome report
_app.produceTestReport = (limit, successes, errors) => {
    console.log('');
    console.log('------------- BEGIN TEST REPORT ---------------');
    console.log('');
    console.log(`Total Tests: ${limit}`);
    console.log(`Pass: ${successes}`);
    console.log(`Fail: ${errors.length}`);
    console.log('');

    // If errors, print them in detail
    if(errors.length > 0){
        console.log('------------- BEGIN ERROR REPORT ---------------');
        console.log('');
        errors.forEach((testError) => {
            console.log('\x1b[31m%s\x1b[0m', testError.name);
            console.log(testError.error);
            console.log('');
        });
        console.log('');
        console.log('------------- END ERROR REPORT ---------------');
    }

    console.log('');
    console.log('------------- END TEST REPORT ---------------');
    process.exit(0);
};

// Run the tests
_app.runTests();
