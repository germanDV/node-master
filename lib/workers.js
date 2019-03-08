/*
 * Perform the checks set up by the users
 *
 */

// Dependencies
const https = require('https');
const http = require('http');
const url = require('url');
const util = require('util');
const _data = require('./data.js');
const _logs = require('./logs.js');
const helpers = require('./helpers.js');

// To log to the console the messages on this module, set NODE_DEBUG=workers
const debug = util.debuglog('workers');

// Instantiate workers
const workers = {};

// Alert user as to a change in check status
workers.alertUserToStatusChange = (newCheckData) => {
    const msg = `Alert: your check for ${newCheckData.method.toUpperCase()} ${newCheckData.protocol}://${newCheckData.url} is currently ${newCheckData.state}`;
    helpers.sendTwilioSMS(newCheckData.userPhone, msg)
        .then(() => debug('Success: user was alerted to a status change in their check via SMS.', msg))
        .catch(() => debug('Error: could not send SMS alert to user.'));
};

workers.log = (originalCheckData, checkOutcome, state, alertWarranted, timeOfCheck) => {
    // Form log data
    const logData = {
        check: originalCheckData,
        outcome: checkOutcome,
        state,
        alert: alertWarranted,
        time: timeOfCheck,
    };

    const logString = JSON.stringify(logData);
    const logFileName = originalCheckData.id;

    // Append to log file
    _logs.append(logFileName, logString)
        .then(() => debug('Logging to file succeeded.'))
        .catch(() => debug('Logging to file failed.'));
};

// Process check outcome, trigger alert to user if needed
workers.processCheckOutcome = async(originalCheckData, checkOutcome) => {
    // Decide if the check is considered up or down
    const state = !checkOutcome.error && checkOutcome.responseCode && originalCheckData.successCodes.indexOf(checkOutcome.responseCode) > -1
        ? 'up'
        : 'down';

    // Decide if an alert is needed
    const alertWarranted = originalCheckData.lastChecked && originalCheckData.state !== state;

    // Log the outcome
    const timeOfCheck = Date.now();
    workers.log(originalCheckData, checkOutcome, state, alertWarranted, timeOfCheck);

    // Update check data
    const newCheckData = {
        ...originalCheckData,
        state,
        lastChecked: timeOfCheck,
    };

    // Save the update
    try{
        await _data.update('checks', newCheckData.id, newCheckData);

        // Send new check data to next step if needed
        if(alertWarranted){
            workers.alertUserToStatusChange(newCheckData);
        } else{
            debug('Check outcome has not changed. No alert needed.');
        }
    } catch(err){
        debug('Error trying to save updates to one of the checks.');
    }
};

// Peform the check
workers.performCheck = (originalCheckData) => {
    // Prepare the initial check outcome
    const checkOutcome = {
        error: false,
        responseCode: false,
    };

    // Mark that outcome has not been set yet
    let outcomeSent = false;

    // Parse hostname and path
    const parsedUrl = url.parse(`${originalCheckData.protocol}://${originalCheckData.url}`, true);
    const {
        hostname,
        path,
    } = parsedUrl;

    // Construct the request
    const requestDetails = {
        protocol: `${originalCheckData.protocol}:`,
        hostname,
        method: originalCheckData.method.toUpperCase(),
        path,
        timeout: originalCheckData.timeoutSeconds * 1000,
    };

    // Instantiate the request object
    const _moduleToUse = originalCheckData.protocol === 'http' ? http : https;
    const req = _moduleToUse.request(requestDetails, (res) => {
        // Update check outcome and pass data along
        checkOutcome.responseCode = res.statusCode;
        if(!outcomeSent){
            workers.processCheckOutcome(originalCheckData, checkOutcome);
            outcomeSent = true;
        }
    });

    // Bind to the error event so it does not get thrown
    req.on('error', (e) => {
        // Update the check outcome and pass data along
        checkOutcome.error = {
            error: true,
            value: e,
        };

        if(!outcomeSent){
            workers.processCheckOutcome(originalCheckData, checkOutcome);
            outcomeSent = true;
        }
    });

    // Bind to timeout event
    req.on('timeout', () => {
        // Update the check outcome and pass data along
        checkOutcome.error = {
            error: true,
            value: 'timeout',
        };

        if(!outcomeSent){
            workers.processCheckOutcome(originalCheckData, checkOutcome);
            outcomeSent = true;
        }
    });

    // End the request (to actually send it)
    req.end();
};


// Sanity check the check data
workers.validateCheckData = (originalCheckData) => {
    originalCheckData = typeof originalCheckData === 'object' && originalCheckData !== null
        ? originalCheckData
        : {};

    originalCheckData.id = typeof originalCheckData.id === 'string' && originalCheckData.id.length === 20
        ? originalCheckData.id
        : false;

    originalCheckData.userPhone = typeof originalCheckData.userPhone === 'string' && originalCheckData.userPhone.length === 10
        ? originalCheckData.userPhone
        : false;

    originalCheckData.protocol = typeof originalCheckData.protocol === 'string' && ['http', 'https'].indexOf(originalCheckData.protocol) > -1
        ? originalCheckData.protocol
        : false;

    originalCheckData.url = typeof originalCheckData.url === 'string' && originalCheckData.url.length > 0
        ? originalCheckData.url
        : false;

    originalCheckData.method = typeof originalCheckData.method === 'string' && ['post', 'get', 'put', 'delete'].indexOf(originalCheckData.method) > -1
        ? originalCheckData.method
        : false;

    originalCheckData.successCodes = typeof originalCheckData.successCodes === 'object' && originalCheckData.successCodes instanceof Array && originalCheckData.successCodes.length > 0
        ? originalCheckData.successCodes
        : false;

    originalCheckData.timeoutSeconds = typeof originalCheckData.timeoutSeconds === 'number' && originalCheckData.timeoutSeconds % 1 === 0 && originalCheckData.timeoutSeconds >= 1 && originalCheckData.timeoutSeconds <= 5
        ? originalCheckData.timeoutSeconds
        : false;

    // Set the keys may not be set if the workers have never seen this check before
    originalCheckData.state = typeof originalCheckData.state === 'string' && ['up', 'down'].indexOf(originalCheckData.state) > -1
        ? originalCheckData.state
        : 'down';

    originalCheckData.lastChecked = typeof originalCheckData.lastChecked === 'number' && originalCheckData.lastChecked > 0
        ? originalCheckData.lastChecked
        : false;

    // If all the check pass, pass data along to next process
    if(
        originalCheckData.id
        && originalCheckData.userPhone
        && originalCheckData.protocol
        && originalCheckData.url
        && originalCheckData.method
        && originalCheckData.successCodes
        && originalCheckData.timeoutSeconds
    ){
        workers.performCheck(originalCheckData);
    } else{
        debug('Error: one of the checks is not properly formatted.');
    }
};

// Lookup all checks and send data to validator
workers.gatherAllChecks = async() => {
    try{
        // Get all the existing checks
        const checks = await _data.list('checks');

        if(checks.length > 0){
            checks.forEach((check) => {
                // Read check data
                _data.read('checks', check)
                    .then((originalCheckData) => {
                        // Pass the data to the check validator
                        workers.validateCheckData(originalCheckData);
                    })
                    .catch(() => debug('Error reading one of the check\'s data'));
            });
        } else{
            debug('Error: could not find any checks to process.');
        }
    } catch(err){
        debug(err);
    }
};

// Timer to execute worker process once per minute
workers.loop = () => {
    setInterval(() => workers.gatherAllChecks(), 1000 * 60);
};

// Rotate logs
workers.rotateLogs = async() => {
    try{
        // List all the non-compressed log files
        const logs = await _logs.list(false);

        if(logs.length > 0){
            logs.forEach((logName) => {
                // Compress data to a different file
                const logId = logName.replace('.log', '');
                const newFileId = `${logId}-${Date.now()}`;
                _logs.compress(logId, newFileId)
                    // Truncate the log
                    .then(() => _logs.truncate(logId))
                    .then(() => debug('Success truncating log file.'))
                    .catch(err => debug(err));
            });
        } else{
            debug('Error: could not find any logs to rotate.');
        }
    } catch(err){
        debug(err);
    }
};

// Timer to execute log rotation once per day
workers.logRotationLoop = () => {
    setInterval(() => workers.rotateLogs(), 1000 * 60 * 60 * 24);
};

// Init script
workers.init = () => {
    // Send to console in yellow
    console.log('\x1b[33m%s\x1b[0m', 'Background workers are running.');

    // Execute all the checks immediately
    workers.gatherAllChecks();

    // Call the loop so checks continue to execute
    workers.loop();

    // Compress all the logs immediately
    workers.rotateLogs();

    // Call the compression loop
    workers.logRotationLoop();
};

// Export
module.exports = workers;
