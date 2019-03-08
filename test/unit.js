/*
 * Unit tests
 *
 */

// Dependencies
const assert = require('assert');
const helpers = require('../lib/helpers.js');
const logs = require('../lib/logs.js');
const exampleDebuggingProblem = require('../lib/exampleDebuggingProblem.js');

const unit = {};

// Assert that getANumber returns a number
unit['helpers.getANumber should return a number'] = (done) => {
    const val = helpers.getANumber();
    assert.equal(typeof val, 'number');
    done();
};

// Assert that getANumber returns 1
unit['helpers.getANumber should return 1'] = (done) => {
    const val = helpers.getANumber();
    assert.equal(val, 1);
    done();
};

// Assert that getANumber returns 2
unit['helpers.getANumber should return 2'] = (done) => {
    const val = helpers.getANumber();
    assert.equal(val, 2);
    done();
};

// logs.list should return an array
function logsList(){
    return new Promise((resolve) => {
        logs.list(true)
            .then(logFileNames => resolve(logFileNames))
            .catch(() => resolve([]));
    });
}
unit['logs.list should return an array'] = async(done) => {
    const logFileNames = await logsList();
    assert.ok(logFileNames instanceof Array);
    assert.ok(logFileNames.length > 0);
    done();
};

// logs.truncate should not throw event with a non-existing logId
unit['logs.truncate should not throw'] = (done) => {
    assert.doesNotThrow(() => {
        logs.truncate('I do not exist')
            .then(() => done())
            .catch((err) => {
                assert.ok(err);
                done();
            });
    }, TypeError);
};

// exampleDebuggingProblem.init should not throw (but it does)
unit['exampleDebuggingProblem.init should not throw'] = (done) => {
    assert.doesNotThrow(() => {
        exampleDebuggingProblem.init();
        done();
    }, TypeError);
};

module.exports = unit;
