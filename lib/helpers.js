/*
 * Helpers for misc. tasks
 *
 */

// Dependencies
const crypto = require('crypto');
const querystring = require('querystring');
const https = require('https');
const path = require('path');
const fs = require('fs');
const config = require('../config.js');

// Hash a string and return hashed version
function hash(str){
    if(typeof str === 'string' && str.length > 0){
        const hashed = crypto.createHmac('sha256', config.HASHING_SECRET).update(str).digest('hex');
        return hashed;
    } else{
        return false;
    }
}

// Parse JSON string to object, without throwing an error
function parseJsonToObj(str){
    try{
        const obj = JSON.parse(str);
        return obj;
    } catch(err){
        return {};
    }
}

// Create random string of alpha numeric characters
function createRandomString(strLength){
    if(!isNaN(strLength) && strLength > 0){
        // Possible characters
        const possible = 'abcdefghijklmnopqrstuvwxyz0123456789';

        let str = '';

        for(let i = 0; i < strLength; i++){
            // Get random character from "possible"
            const randomChar = possible.charAt(Math.floor(Math.random() * possible.length));

            // Append character to final string
            str += randomChar;
        }

        return str;
    } else{
        return false;
    }
}

// Send SMS via Twilio
function sendTwilioSMS(phone, msg){
    return new Promise((resolve, reject) => {
        // Validate parameters
        phone = typeof phone === 'string' && phone.trim().length === 10
            ? phone.trim()
            : false;

        msg = typeof msg === 'string' && msg.trim().length > 0 && msg.trim().length < 1600
            ? msg.trim()
            : false;

        if(phone && msg){
            // Configure data to be sent to Twilio
            const payload = {
                From: config.twilio.fromPhone,
                To: `+1${phone}`,
                Body: msg,
            };

            const stringPayload = querystring.stringify(payload);

            // HTTPS request details
            const requestDetails = {
                protocol: 'https:',
                hostname: 'api.twilio.com',
                method: 'POST',
                path: `/2010-04-01/Accounts/${config.twilio.accountSid}/Messages.json`,
                auth: `${config.twilio.accountSid}:${config.twilio.authToken}`,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Content-Length': Buffer.byteLength(stringPayload),
                },
            };

            // Instantiate the request
            const req = https.request(requestDetails, (res) => {
                // Grab status of the response
                const status = res.statusCode;

                if(status == 200 || status == 201){
                    resolve('SMS sent.');
                } else{
                    reject(`Status code returned: ${status}`);
                }
            });

            // Bind to error event so it doesn't get thrown
            req.on('error', error => reject(error));

            // Add payload to the request
            req.write(stringPayload);

            // Send the request
            req.end();
        } else{
            reject('Invalid or missing parameters.');
        }
    });
}

// Take a given string and a data object and replace all the keys within it
function interpolate(str, data){
    str = typeof str === 'string' && str.length > 0 ? str : '';
    data = typeof data === 'object' && data !== null ? data : {};

    // Add template globals to the data object and prepend "gobal." to the key name
    for(const keyName in config.templateGlobals){
        if(config.templateGlobals.hasOwnProperty(keyName)){
            data[`global.${keyName}`] = config.templateGlobals[keyName];
        }
    }

    // Replace placeholders in str with the values of the data object
    for(const key in data){
        if(data.hasOwnProperty(key) && typeof data[key] === 'string'){
            str = str.replace(`{${key}}`, data[key]);
        }
    }

    return str;
}

// Get string content of a template
function getTemplate(templateName, data){
    return new Promise((resolve, reject) => {
        templateName = typeof templateName === 'string' && templateName.length > 0
            ? templateName
            : false;

        data = typeof data === 'object' && data !== null ? data : {};

        if(templateName){
            const templatesDir = path.join(__dirname, '../templates/');

            fs.readFile(`${templatesDir}${templateName}.html`, 'utf-8', (err, str) => {
                if(!err && str && str.length > 0){
                    // Do interpolation to replace placeholders with variables
                    const finalStr = interpolate(str, data);

                    resolve(finalStr);
                } else{
                    reject('No template found.');
                }
            });
        } else{
            reject('Missing or invalid template name.');
        }
    });
}

// Add universal header and footer to all templates
function addUniversalTemplates(str, data){
    return new Promise(async(resolve, reject) => {
        str = typeof str === 'string' && str.length > 0 ? str : '';
        data = typeof data === 'object' && data !== null ? data : {};

        try{
            // Get the header
            const headerString = await getTemplate('_header', data);

            // Get the footer
            const footerString = await getTemplate('_footer', data);

            // Concatenate the strings
            const fullString = headerString + str + footerString;

            resolve(fullString);
        } catch(err){
            reject(err);
        }
    });
}

// Get a static (public) asset
function getStaticAsset(fileName){
    return new Promise(async(resolve, reject) => {
        fileName = typeof fileName === 'string' && fileName.length > 0
            ? fileName
            : false;

        if(fileName){
            const publicDir = path.join(__dirname, '../public/');
            fs.readFile(`${publicDir}${fileName}`, (err, data) => {
                if(!err && data){
                    resolve(data);
                } else{
                    reject('No asset found.');
                }
            });
        } else{
            reject('Missing or invalid asset name.');
        }
    });
}

// Sample for testing that simply returns a number
function getANumber(){
    return 1;
}

module.exports = {
    hash,
    parseJsonToObj,
    createRandomString,
    sendTwilioSMS,
    getTemplate,
    addUniversalTemplates,
    getStaticAsset,
    getANumber,
};
