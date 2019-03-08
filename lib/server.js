/*
 * Server related tasks
 *
 */

// Dependecies
const http = require('http');
const https = require('https');
const url = require('url');
const fs = require('fs');
const { StringDecoder } = require('string_decoder');
const path = require('path');
const util = require('util');
const config = require('../config.js');
const handlers = require('./handlers.js');
const helpers = require('./helpers.js');

// To log to the console the messages on this module, set NODE_DEBUG=server
const debug = util.debuglog('server');

// Instantiate server module object
const server = {};

// Define a router
server.router = {
    '': handlers.index,
    'account/create': handlers.accountCreate,
    'account/edit': handlers.accountEdit,
    'account/deleted': handlers.accountDeleted,
    'session/create': handlers.sessionCreate,
    'session/deleted': handlers.sessionDeleted,
    'checks/all': handlers.checksList,
    'checks/create': handlers.checksCreate,
    'checks/edit': handlers.checksEdit,
    'ping': handlers.ping,
    'api/users': handlers.users,
    'api/tokens': handlers.tokens,
    'api/checks': handlers.checks,
    'favicon.ico': handlers.favicon,
    'public': handlers.public,
    'examples/error': handlers.exampleError,
};

// Process the response from the handler
function processHandlerResponse(res, method, trimmedPath, statusCode, payload, contentType){
    // If not provided, default contentType to JSON
    contentType = typeof contentType === 'string' ? contentType : 'json';

    // If no status code is provided, default to 200
    statusCode = typeof statusCode === 'number' ? statusCode : 200;

    // Response parts that are content-specific
    let payloadString = '';
    if(contentType === 'json'){
        res.setHeader('Content-Type', 'application/json');
        payload = typeof payload === 'object' ? payload : {};
        payloadString = JSON.stringify(payload);
    }
    if(contentType === 'html'){
        res.setHeader('Content-Type', 'text/html');
        payloadString = typeof payload === 'string' ? payload : '';
    }
    if(contentType === 'favicon'){
        res.setHeader('Content-Type', 'image/x-icon');
        payloadString = typeof payload !== 'undefined' ? payload : '';
    }
    if(contentType === 'css'){
        res.setHeader('Content-Type', 'text/css');
        payloadString = typeof payload !== 'undefined' ? payload : '';
    }
    if(contentType === 'png'){
        res.setHeader('Content-Type', 'image/png');
        payloadString = typeof payload !== 'undefined' ? payload : '';
    }
    if(contentType === 'jpg'){
        res.setHeader('Content-Type', 'image/jpeg');
        payloadString = typeof payload !== 'undefined' ? payload : '';
    }
    if(contentType === 'plain'){
        res.setHeader('Content-Type', 'text/plain');
        payloadString = typeof payload !== 'undefined' ? payload : '';
    }

    // Response parts that are common
    res.writeHead(statusCode);

    // Send response
    res.end(payloadString);

    // If response is 200 print green, otherwise print red
    if(statusCode === 200 || statusCode === 201){
        debug('\x1b[32m%s\x1b[0m', `${method.toUpperCase()} /${trimmedPath} ${statusCode}`);
    } else{
        debug('\x1b[31m%s\x1b[0m', `${method.toUpperCase()} /${trimmedPath} ${statusCode}`);
    }
}

// Server logic for both http and https
server.unifiedServer = (req, res) => {
    // Parse URL. The second parameter indicates that the query string should be parsed too.
    const parsedUrl = url.parse(req.url, true);

    // Get path from the URL
    const path = parsedUrl.pathname;
    const trimmedPath = path.replace(/^\/+|\/+$/g, '');

    // Get query string as an object
    const queryStringObj = parsedUrl.query;

    // Get HTTP method
    const method = req.method.toLowerCase();

    // Get headers as an object
    const { headers } = req;

    // Get payload sent by user, if any
    const decoder = new StringDecoder('utf-8');
    let buffer = '';
    req.on('data', data => buffer += decoder.write(data));
    req.on('end', () => {
        buffer += decoder.end();

        // Select appropriate handler, use notFound handler if none is found
        let chosenHandler = typeof server.router[trimmedPath] !== 'undefined'
            ? server.router[trimmedPath]
            : handlers.notFound;

        // If the request is to the public directory, use the public handler
        chosenHandler = trimmedPath.indexOf('public/') > -1 ? handlers.public : chosenHandler;

        // Data to send to handler
        const data = {
            trimmedPath,
            queryStringObj,
            method,
            headers,
            payload: helpers.parseJsonToObj(buffer),
        };

        // Call the handler
        try{
            chosenHandler(data, (statusCode, payload, contentType) => {
                processHandlerResponse(res, method, trimmedPath, statusCode, payload, contentType);
            });
        } catch(e){
            debug(e);
            processHandlerResponse(res, method, trimmedPath, 500, { Error: 'An unknown error has occurred' }, 'json');
        }
    });
};

// Instantiate HTTP server
server.httpServer = http.createServer((req, res) => server.unifiedServer(req, res));

// Instantiate HTTPS server
server.httpsServerOptions = {
    key: fs.readFileSync(path.join(__dirname, '../https/key.pem')),
    cert: fs.readFileSync(path.join(__dirname, '../https/cert.pem')),
};
server.httpsServer = https.createServer(server.httpsServerOptions, (req, res) => {
    server.unifiedServer(req, res);
});

// Init script
server.init = () => {
    // Start the HTTP server
    server.httpServer.listen(config.HTTP_PORT, () => {
        console.log('\x1b[36m%s\x1b[0m', `The server is listening on port ${config.HTTP_PORT} in ${config.ENV_NAME} mode.`);
    });

    // Start the HTTPS server
    server.httpsServer.listen(config.HTTPS_PORT, () => {
        console.log('\x1b[35m%s\x1b[0m', `The server is listening on port ${config.HTTPS_PORT} in ${config.ENV_NAME} mode.`);
    });
};

// Export
module.exports = server;
