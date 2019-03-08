/*
 * API Tests
 *
 */

// Dependencies
const assert = require('assert');
const http = require('http');
const app = require('../index.js');
const config = require('../config.js');

// Holder for Tests
const api = {};

function makeGetRequest(path, callback){
    // Configure the request details
    const requestDetails = {
        protocol: 'http:',
        hostname: 'localhost',
        port: config.HTTP_PORT,
        method: 'GET',
        path,
        headers: {
            'Content-Type': 'application/json',
        },
    };

    // Send the request
    const req = http.request(requestDetails, res => callback(res));
    req.end();
}

// The main init() function should be able to run without throwing.
api['app.init should start without throwing'] = (done) => {
    assert.doesNotThrow(() => {
        app.init(() => done());
    }, TypeError);
};

// Make a request to /ping
api['/ping should respond to GET with 200'] = (done) => {
    makeGetRequest('/ping', (res) => {
        assert.equal(res.statusCode, 200);
        done();
    });
};

// Make a request to /api/users
api['/api/users should respond to GET with 400'] = (done) => {
    makeGetRequest('/api/users', (res) => {
        assert.equal(res.statusCode, 400);
        done();
    });
};

// Make a request to a random path
api['A random path should respond to GET with 404'] = (done) => {
    makeGetRequest('/this/path/shouldnt/exist', (res) => {
        assert.equal(res.statusCode, 404);
        done();
    });
};

// Export the tests to the runner
module.exports = api;
