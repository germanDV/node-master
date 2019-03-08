/*
 * Route handlers for requests received by the server
 *
 */

// Dependencies
const _url = require('url');
const dns = require('dns');
const _performance = require('perf_hooks').performance;
const { PerformanceObserver } = require('perf_hooks');
const util = require('util');
const _data = require('./data.js');
const helpers = require('./helpers.js');
const config = require('../config.js');

const debug = util.debuglog('performance');

// Define handlers
const handlers = {};

/*
 * HTML handlers
 *
 */

// Index
handlers.index = async(data, callback) => {
    // Reject any request that is not GET
    if(data.method === 'get'){
        try{
            // Prepare data for interpolation
            const templateData = {
                'head.title': 'Uptime Monitoring Made Simple',
                'head.description': 'We offer free simple uptime monitoring for HTTP/HTTPS sites of all kinds. When your site goes down, we will send you a text to let you kwnow.',
                'body.class': 'index',
            };

            // Read the index template as a string
            const str = await helpers.getTemplate('index', templateData);

            // Add header and footer
            const fullStr = await helpers.addUniversalTemplates(str, templateData);

            callback(200, fullStr, 'html');
        } catch(err){
            console.log(err);
            callback(500, undefined, 'html');
        }
    } else{
        callback(405, undefined, 'html');
    }
};

// Signup
handlers.accountCreate = async(data, callback) => {
    // Reject any request that is not GET
    if(data.method === 'get'){
        try{
            // Prepare data for interpolation
            const templateData = {
                'head.title': 'Create an Account',
                'head.description': 'Signup is easy and only takes a few seconds.',
                'body.class': 'accountCreate',
            };

            // Read the index template as a string
            const str = await helpers.getTemplate('accountCreate', templateData);

            // Add header and footer
            const fullStr = await helpers.addUniversalTemplates(str, templateData);

            callback(200, fullStr, 'html');
        } catch(err){
            console.log(err);
            callback(500, undefined, 'html');
        }
    } else{
        callback(405, undefined, 'html');
    }
};

// Login
handlers.sessionCreate = async(data, callback) => {
    // Reject any request that is not GET
    if(data.method === 'get'){
        try{
            // Prepare data for interpolation
            const templateData = {
                'head.title': 'Login To Your Account',
                'head.description': 'Please enter your phone number and password.',
                'body.class': 'sessionCreate',
            };

            // Read the index template as a string
            const str = await helpers.getTemplate('sessionCreate', templateData);

            // Add header and footer
            const fullStr = await helpers.addUniversalTemplates(str, templateData);

            callback(200, fullStr, 'html');
        } catch(err){
            console.log(err);
            callback(500, undefined, 'html');
        }
    } else{
        callback(405, undefined, 'html');
    }
};

// Logout
handlers.sessionDeleted = async(data, callback) => {
    // Reject any request that is not GET
    if(data.method === 'get'){
        try{
            // Prepare data for interpolation
            const templateData = {
                'head.title': 'Logged Out',
                'head.description': 'You have been logged out of your account.',
                'body.class': 'sessionDeleted',
            };

            // Read the index template as a string
            const str = await helpers.getTemplate('sessionDeleted', templateData);

            // Add header and footer
            const fullStr = await helpers.addUniversalTemplates(str, templateData);

            callback(200, fullStr, 'html');
        } catch(err){
            console.log(err);
            callback(500, undefined, 'html');
        }
    } else{
        callback(405, undefined, 'html');
    }
};

// Account edit
handlers.accountEdit = async(data, callback) => {
    // Reject any request that is not GET
    if(data.method === 'get'){
        try{
            // Prepare data for interpolation
            const templateData = {
                'head.title': 'Account Settings',
                'body.class': 'accountEdit',
            };

            // Read the index template as a string
            const str = await helpers.getTemplate('accountEdit', templateData);

            // Add header and footer
            const fullStr = await helpers.addUniversalTemplates(str, templateData);

            callback(200, fullStr, 'html');
        } catch(err){
            console.log(err);
            callback(500, undefined, 'html');
        }
    } else{
        callback(405, undefined, 'html');
    }
};

// Account deleted
handlers.accountDeleted = async(data, callback) => {
    // Reject any request that is not GET
    if(data.method === 'get'){
        try{
            // Prepare data for interpolation
            const templateData = {
                'head.title': 'Account Deleted',
                'head.description': 'Your Account Has Been Deleted.',
                'body.class': 'accountDeleted',
            };

            // Read the index template as a string
            const str = await helpers.getTemplate('accountDeleted', templateData);

            // Add header and footer
            const fullStr = await helpers.addUniversalTemplates(str, templateData);

            callback(200, fullStr, 'html');
        } catch(err){
            console.log(err);
            callback(500, undefined, 'html');
        }
    } else{
        callback(405, undefined, 'html');
    }
};

// Create a new check
handlers.checksCreate = async(data, callback) => {
    // Reject any request that is not GET
    if(data.method === 'get'){
        try{
            // Prepare data for interpolation
            const templateData = {
                'head.title': 'Create A New Check',
                'body.class': 'checksCreate',
            };

            // Read the index template as a string
            const str = await helpers.getTemplate('checksCreate', templateData);

            // Add header and footer
            const fullStr = await helpers.addUniversalTemplates(str, templateData);

            callback(200, fullStr, 'html');
        } catch(err){
            console.log(err);
            callback(500, undefined, 'html');
        }
    } else{
        callback(405, undefined, 'html');
    }
};

// Dashboard
handlers.checksList = async(data, callback) => {
    // Reject any request that is not GET
    if(data.method === 'get'){
        try{
            // Prepare data for interpolation
            const templateData = {
                'head.title': 'Dashboard',
                'body.class': 'checksList',
            };

            // Read the index template as a string
            const str = await helpers.getTemplate('checksList', templateData);

            // Add header and footer
            const fullStr = await helpers.addUniversalTemplates(str, templateData);

            callback(200, fullStr, 'html');
        } catch(err){
            console.log(err);
            callback(500, undefined, 'html');
        }
    } else{
        callback(405, undefined, 'html');
    }
};

// Edit a check
handlers.checksEdit = async(data, callback) => {
    // Reject any request that is not GET
    if(data.method === 'get'){
        try{
            // Prepare data for interpolation
            const templateData = {
                'head.title': 'Check Details',
                'body.class': 'checksEdit',
            };

            // Read the index template as a string
            const str = await helpers.getTemplate('checksEdit', templateData);

            // Add header and footer
            const fullStr = await helpers.addUniversalTemplates(str, templateData);

            callback(200, fullStr, 'html');
        } catch(err){
            console.log(err);
            callback(500, undefined, 'html');
        }
    } else{
        callback(405, undefined, 'html');
    }
};

// Favicon
handlers.favicon = async(data, callback) => {
    // Reject any request that is not GET
    if(data.method === 'get'){
        try{
            const favicon = await helpers.getStaticAsset('favicon.ico');
            callback(200, favicon, 'favicon');
        } catch(err){
            callback(500);
        }
    } else{
        callback(405);
    }
};

// Public assets
handlers.public = async(data, callback) => {
    // Reject any request that is not GET
    if(data.method === 'get'){
        try{
            // Get the file name being requested
            const trimmedAssetName = data.trimmedPath.replace('public/', '').trim();

            if(trimmedAssetName.length > 0){
                const asset = await helpers.getStaticAsset(trimmedAssetName);

                // Determine type of asset (default to plain text)
                let contentType = 'plain';

                if(trimmedAssetName.indexOf('.css') > -1){
                    contentType = 'css';
                }

                if(trimmedAssetName.indexOf('.png') > -1){
                    contentType = 'png';
                }

                if(trimmedAssetName.indexOf('.jpg') > -1){
                    contentType = 'jpg';
                }

                if(trimmedAssetName.indexOf('.ico') > -1){
                    contentType = 'favicon';
                }

                callback(200, asset, contentType);
            } else{
                callback(404);
            }
        } catch(err){
            callback(500);
        }
    } else{
        callback(405);
    }
};


/*
 * JSON API handlers
 *
 */

// Users
handlers.users = (data, callback) => {
    const acceptableMethods = ['post', 'get', 'put', 'delete'];
    if(acceptableMethods.indexOf(data.method) > -1){
        handlers._users[data.method](data, callback);
    } else{
        callback(405);
    }
};

// Users sub-methods
handlers._users = {
    // Required data: firstName, lastName, phone, password, tosAgreement
    // Optional data: none
    post: async(data, callback) => {
        const firstName = data.payload.firstName && data.payload.firstName.trim().length > 0
            ? data.payload.firstName.trim()
            : false;

        const lastName = data.payload.lastName && data.payload.lastName.trim().length > 0
            ? data.payload.lastName.trim()
            : false;

        const phone = data.payload.phone && data.payload.phone.trim().length === 10
            ? data.payload.phone.trim()
            : false;

        const password = data.payload.password && data.payload.password.trim().length > 0
            ? data.payload.password.trim()
            : false;

        const { tosAgreement } = data.payload;

        if(firstName && lastName && phone && password && tosAgreement){
            // Make sure user doesn't already exist
            _data.read('users', phone)
                .then(() => {
                    // The user already exists
                    callback(404, { Error: 'A user with that phone number already exists.' });
                })
                .catch(() => {
                    // This means the user does not exist
                    // Hash the password
                    const hashedPassword = helpers.hash(password);

                    if(hashedPassword){
                        // Create user object
                        const userObj = {
                            firstName,
                            lastName,
                            phone,
                            hashedPassword,
                            tosAgreement: true,
                        };

                        // Store the user
                        _data.create('users', phone, userObj)
                            .then(() => callback(200))
                            .catch(err => callback(500, { Error: err }));
                    } else{
                        callback(500, { Error: 'Error hashing password.' });
                    }
                });
        } else{
            callback(400, { Error: 'Missing required fields.' });
        }
    },

    // Required data: phone
    // Optional data: none
    get: async(data, callback) => {
        // Check that phone is valid
        const phone = data.queryStringObj.phone && data.queryStringObj.phone.length === 10
            ? data.queryStringObj.phone
            : false;

        if(phone){
            try{
                // Get token from headers
                const token = typeof data.headers.token === 'string' ? data.headers.token : false;

                // Verify that the given token is valid for the user
                await handlers._tokens.verifyToken(token, phone);

                // Fetch user data
                const userData = await _data.read('users', phone);

                // Remove hashed password
                delete userData.hashedPassword;

                // Send response with success status code
                callback(200, userData);
            } catch(err){
                if(err === false){
                    callback(403, { Error: 'Missing or invalid token.' });
                } else{
                    callback(404, { Error: err });
                }
            }
        } else{
            callback(400, { Error: 'Missing required filed.' });
        }
    },

    // Required data: phone
    // Optional data: firstName, lastName, password (at least one is needed)
    put: async(data, callback) => {
        // Check that phone is valid
        const phone = data.payload.phone && data.payload.phone.length === 10
            ? data.payload.phone
            : false;

        // Check the rest of the data
        const firstName = data.payload.firstName && data.payload.firstName.trim().length > 0
            ? data.payload.firstName.trim()
            : false;

        const lastName = data.payload.lastName && data.payload.lastName.trim().length > 0
            ? data.payload.lastName.trim()
            : false;

        const password = data.payload.password && data.payload.password.trim().length > 0
            ? data.payload.password.trim()
            : false;

        if(phone){
            if(firstName || lastName || password){
                try{
                    // Get token from headers
                    const token = typeof data.headers.token === 'string' ? data.headers.token : false;

                    // Verify that the given token is valid for the user
                    await handlers._tokens.verifyToken(token, phone);

                    // Make sure user doesn't already exist
                    const userData = await _data.read('users', phone);

                    // Update necessary fields
                    const updatedUser = {
                        firstName: firstName || userData.firstName,
                        lastName: lastName || userData.lastName,
                        phone: userData.phone,
                        hashedPassword: helpers.hash(password) || userData.hashedPassword,
                        tosAgreement: userData.tosAgreement,
                    };

                    // Store the updated data
                    await _data.update('users', phone, updatedUser);

                    // Send response with success status code
                    callback(200);
                } catch(err){
                    if(err === false){
                        callback(403, { Error: 'Missing or invalid token.' });
                    } else{
                        callback(404, { Error: err });
                    }
                }
            } else{
                callback(400, { Error: 'Missing fileds to update.' });
            }
        } else{
            callback(400, { Error: 'Missing required filed.' });
        }
    },

    // Required data: phone
    // Optional data: none
    delete: async(data, callback) => {
        // Check that phone is valid
        const phone = data.queryStringObj.phone && data.queryStringObj.phone.length === 10
            ? data.queryStringObj.phone
            : false;

        if(phone){
            try{
                // Get token from headers
                const token = typeof data.headers.token === 'string' ? data.headers.token : false;

                // Verify that the given token is valid for the user
                await handlers._tokens.verifyToken(token, phone);

                // Fetch user data to make sure the user exists
                const userData = await _data.read('users', phone);

                // Delete user
                await _data.del('users', phone);

                // Delete checks associated with the user
                const userChecks = typeof userData.checks === 'object' && userData.checks instanceof Array ? userData.checks : [];
                for(const userCheck of userChecks){
                    await _data.del('checks', userCheck);
                }

                // Send response with success status code
                callback(200);
            } catch(err){
                if(err === 'Error deleting file.'){
                    callback(500, { Error: 'Could not delete specified user.' });
                } else if(err === false){
                    callback(403, { Error: 'Missing or invalid token.' });
                } else{
                    callback(400, { Error: 'Could not find specified user.' });
                }
            }
        } else{
            callback(400, { Error: 'Missing required filed.' });
        }
    },
};

// Tokens
handlers.tokens = (data, callback) => {
    const acceptableMethods = ['post', 'get', 'put', 'delete'];
    if(acceptableMethods.indexOf(data.method) > -1){
        handlers._tokens[data.method](data, callback);
    } else{
        callback(405);
    }
};

// Tokens sub-methods
handlers._tokens = {
    // Required data: phone, password
    // Optional data: none
    post: async(data, callback) => {
        _performance.mark('entered function');
        const phone = data.payload.phone && data.payload.phone.trim().length === 10
            ? data.payload.phone.trim()
            : false;

        const password = data.payload.password && data.payload.password.trim().length > 0
            ? data.payload.password.trim()
            : false;

        _performance.mark('inputs validated');
        if(phone && password){
            try{
                _performance.mark('beginning user lookup');
                // Fetch the user that matches the phone number
                const userData = await _data.read('users', phone);
                _performance.mark('user lookup complete');

                // Hash sent password and compare it to stored password
                _performance.mark('begginning password hashing');
                const hashedPassword = helpers.hash(password);
                _performance.mark('password hashing complete');
                if(hashedPassword === userData.hashedPassword){
                    // Create token for user, expiration date 1 hour
                    _performance.mark('creating random string');
                    const tokenId = helpers.createRandomString(20);
                    const expires = Date.now() + 1000 * 60 * 60;
                    const tokenObj = {
                        phone,
                        id: tokenId,
                        expires,
                    };
                    
                    _performance.mark('beginning storing token');
                    // Store the token
                    await _data.create('tokens', tokenId, tokenObj);
                    _performance.mark('storing token complete');

                    
                    // Log performance measurements
                    const obs = new PerformanceObserver((list) => {
                        list.getEntries().map((entry) => {
                            debug('\x1b[35m%s\x1b[0m', `${entry.name}: ${entry.duration}`);
                        });
                    });
                    obs.observe({ entryTypes: ['measure'] });

                    // Gather all performance measurements
                    _performance.measure('Begining to end', 'entered function', 'storing token complete');
                    _performance.measure('Validating user input', 'entered function', 'inputs validated');
                    _performance.measure('User lookup', 'beginning user lookup', 'user lookup complete');
                    _performance.measure('Password hashing', 'begginning password hashing', 'password hashing complete');
                    _performance.measure('String for token', 'creating random string', 'beginning storing token');
                    _performance.measure('Storing token', 'beginning storing token', 'storing token complete');
                    
                    callback(200, tokenObj);
                } else{
                    callback(400, { Error: 'Password did not match.' });
                }
            } catch(err){
                if(err === 'Not found.'){
                    callback(400, { Error: 'Could not find specified user.' });
                } else{
                    console.log(err);
                    callback(500, { Error: 'Could not create new token.' });
                }
            }
        } else{
            callback(400, { Error: 'Missing required filed.' });
        }
    },

    // Required data: id
    // Optional data: none
    get: async(data, callback) => {
        // Check that ID is valid
        const id = data.queryStringObj.id && data.queryStringObj.id.length === 20
            ? data.queryStringObj.id
            : false;

        if(id){
            try{
                // Fetch token
                const token = await _data.read('tokens', id);

                // Send response with success status code
                callback(200, token);
            } catch(err){
                callback(404, { Error: err });
            }
        } else{
            callback(400, { Error: 'Missing required filed.' });
        }
    },

    // Require data: id, extend
    // Optional data: none
    put: async(data, callback) => {
        // Check that ID and extend are valid
        const id = data.payload.id && data.payload.id.length === 20
            ? data.payload.id
            : false;

        const { extend } = data.payload;

        if(id && extend){
            try{
                // Fetch the token
                const token = await _data.read('tokens', id);

                // Check token is not expired
                if(token.expires > Date.now()){
                    // Set expiration an hour from now
                    token.expires = Date.now() + 1000 * 60 * 60;

                    // Store update token
                    await _data.update('tokens', id, token);

                    // Send response with success status code
                    callback(200);
                } else{
                    callback(400, { Error: 'The token has already expired.' });
                }
            } catch(err){
                if(err === 'Not found.'){
                    callback(400, { Error: 'Token does not exist.' });
                } else{
                    callback(500, { Error: 'Could not update token expiration.' });
                }
            }
        } else{
            callback(400, { Error: 'Missing required filed.' });
        }
    },

    // Required data: id
    // Optional data: none
    delete: async(data, callback) => {
        // Check that id is valid
        const id = data.queryStringObj.id && data.queryStringObj.id.length === 20
            ? data.queryStringObj.id
            : false;

        if(id){
            try{
                // Fetch tokens to make sure the token exists
                await _data.read('tokens', id);

                // Delete token
                await _data.del('tokens', id);

                // Send response with success status code
                callback(200);
            } catch(err){
                if(err === 'Error deleting file.'){
                    callback(500, { Error: 'Could not delete specified token.' });
                } else{
                    callback(400, { Error: 'Could not find specified token.' });
                }
            }
        } else{
            callback(400, { Error: 'Missing required filed.' });
        }
    },
};

// Verify if a token is valid for a given user
handlers._tokens.verifyToken = (id, phone) => {
    return new Promise((resolve, reject) => {
        _data.read('tokens', id)
            .then((token) => {
                if(token.phone === phone && token.expires > Date.now()){
                    resolve(true);
                } else{
                    reject(false);
                }
            })
            .catch(() => reject(false));
    });
};

// Checks
handlers.checks = (data, callback) => {
    const acceptableMethods = ['post', 'get', 'put', 'delete'];
    if(acceptableMethods.indexOf(data.method) > -1){
        handlers._checks[data.method](data, callback);
    } else{
        callback(405);
    }
};

handlers._checks = {
    // Required data: protocol, url, method, successCodes, timeoutSeconds
    // Optional data: none
    post: async(data, callback) => {
        const protocol = data.payload.protocol && ['http', 'https'].indexOf(data.payload.protocol) > -1
            ? data.payload.protocol
            : false;

        const url = data.payload.url && data.payload.url.trim().length > 0
            ? data.payload.url.trim()
            : false;

        const method = data.payload.method && ['post', 'get', 'put', 'delete'].indexOf(data.payload.method) > -1
            ? data.payload.method
            : false;

        const successCodes = typeof data.payload.successCodes === 'object' && data.payload.successCodes instanceof Array && data.payload.successCodes.length > 0
            ? data.payload.successCodes
            : false;

        const timeoutSeconds = !isNaN(data.payload.timeoutSeconds) && data.payload.timeoutSeconds % 1 === 0 && data.payload.timeoutSeconds >= 1 && data.payload.timeoutSeconds <= 5
            ? data.payload.timeoutSeconds
            : false;

        if(protocol && url && method && successCodes && timeoutSeconds){
            try{
                // Get token from headers
                const token = typeof data.headers.token === 'string' ? data.headers.token : false;

                // Fetch token object
                const tokenData = await _data.read('tokens', token);

                // Look up the user by reading the token
                const userPhone = tokenData.phone;
                const userData = await _data.read('users', userPhone);

                const userChecks = typeof userData.checks === 'object' && userData.checks instanceof Array ? userData.checks : [];

                // Verify that user has less than max checks per user
                if(userChecks.length < config.MAX_CHECKS){
                    // Verify that URL given has DNS entries and therefore can resolve
                    const parsedUrl = _url.parse(`${protocol}://${url}`, true);
                    const hostname = typeof parsedUrl.hostname === 'string' && parsedUrl.hostname.length > 0
                        ? parsedUrl.hostname
                        : false;
                    dns.resolve(hostname, async(err, records) => {
                        if(!err && records){
                            // Create random id for the check
                            const checkId = helpers.createRandomString(20);
        
                            // Create check object
                            const checkObj = {
                                id: checkId,
                                userPhone,
                                protocol,
                                url,
                                method,
                                successCodes,
                                timeoutSeconds,
                            };
        
                            // Store checkObj
                            await _data.create('checks', checkId, checkObj);
        
                            // Add check id to users object
                            userChecks.push(checkId);
                            userData.checks = userChecks;
        
                            // Save updated user data
                            await _data.update('users', userPhone, userData);
        
                            // Send checkObj in the response
                            callback(200, checkObj);
                        } else{
                            callback(400, { Error: 'The hostname entered did not resolve to any DNS entries.' });
                        }
                    });
                } else{
                    callback(400, { Error: `Already has max number of checks (${config.MAX_CHECKS}).` });
                }
            } catch(err){
                if(err === 'Not found.' || err === false){
                    callback(403);
                } else{
                    callback(500, { Error: 'Could not create new check.' });
                }
            }
        } else{
            callback(400, { Error: 'Missing or invalid required fields.' });
        }
    },

    // Required data: id
    // Optional data: none
    get: async(data, callback) => {
        // Check that ID is valid
        const id = data.queryStringObj.id && data.queryStringObj.id.length === 20
            ? data.queryStringObj.id
            : false;

        if(id){
            try{
                // Fetch the check
                const check = await _data.read('checks', id);

                // Get token from headers
                const token = typeof data.headers.token === 'string' ? data.headers.token : false;

                // Verify that token is valid and belongs to the user that created the check
                await handlers._tokens.verifyToken(token, check.userPhone);

                // Return check data
                callback(200, check);
            } catch(err){
                if(err === 'Not found.'){
                    callback(404);
                } else{
                    callback(403);
                }
            }
        } else{
            callback(400, { Error: 'Missing required filed.' });
        }
    },

    // Require data: id
    // Optional data: protocol, url, method, successCodes, timeoutSeconds (one is needed)
    put: async(data, callback) => {
        // Check required data
        const id = data.payload.id && data.payload.id.length === 20
            ? data.payload.id
            : false;

        // Check optional data
        const protocol = data.payload.protocol && ['http', 'https'].indexOf(data.payload.protocol) > -1
            ? data.payload.protocol
            : false;

        const url = data.payload.url && data.payload.url.trim().length > 0
            ? data.payload.url.trim()
            : false;

        const method = data.payload.method && ['post', 'get', 'put', 'delete'].indexOf(data.payload.method) > -1
            ? data.payload.method
            : false;

        const successCodes = typeof data.payload.successCodes === 'object' && data.payload.successCodes instanceof Array && data.payload.successCodes.length > 0
            ? data.payload.successCodes
            : false;

        const timeoutSeconds = !isNaN(data.payload.timeoutSeconds) && data.payload.timeoutSeconds % 1 === 0 && data.payload.timeoutSeconds >= 1 && data.payload.timeoutSeconds <= 5
            ? data.payload.timeoutSeconds
            : false;

        if(id){
            if(protocol || url || method || successCodes || timeoutSeconds){
                try{
                    // Fetch the check
                    const check = await _data.read('checks', id);

                    // Get token from headers
                    const token = typeof data.headers.token === 'string' ? data.headers.token : false;

                    // Verify that the given token is valid and belongs to the user that created the check
                    await handlers._tokens.verifyToken(token, check.userPhone);

                    // Update necessary fields
                    const updatedCheck = {
                        id: check.id,
                        protocol: protocol || check.protocol,
                        url: url || check.url,
                        method: method || check.method,
                        successCodes: successCodes || check.successCodes,
                        timeoutSeconds: timeoutSeconds || check.timeoutSeconds,
                        userPhone: check.userPhone,
                    };

                    // Store the updated data
                    await _data.update('checks', id, updatedCheck);

                    // Send response with success status code
                    callback(200);
                } catch(err){
                    if(err === false){
                        callback(403, { Error: 'Missing or invalid token.' });
                    } else if(err === 'Not Found.'){
                        callback(404);
                    } else{
                        callback(500, { Err: 'Could not update check.' });
                    }
                }
            } else{
                callback(400, { Error: 'Missing fileds to update.' });
            }
        } else{
            callback(400, { Error: 'Missing required filed.' });
        }
    },

    // Required data: id
    // Optional data: none
    delete: async(data, callback) => {
        // Check that id is valid
        const id = data.queryStringObj.id && data.queryStringObj.id.length === 20
            ? data.queryStringObj.id
            : false;

        if(id){
            try{
                // Fetch check to make sure it exists
                const check = await _data.read('checks', id);

                // Get token from headers
                const token = typeof data.headers.token === 'string' ? data.headers.token : false;

                // Verify that the given token is valid for the user
                await handlers._tokens.verifyToken(token, check.userPhone);

                // Delete check
                await _data.del('checks', id);

                // Fetch user data
                const userData = await _data.read('users', check.userPhone);
                const userChecks = typeof userData.checks === 'object' && userData.checks instanceof Array ? userData.checks : [];

                // Find out position of check to be deleted
                const checkPosition = userChecks.indexOf(id);
                if(checkPosition > -1){
                    // Delete check
                    userChecks.splice(checkPosition, 1);
                    userData.checks = userChecks;

                    // Update user data
                    await _data.update('users', check.userPhone, userData);

                    // Reply with success code
                    callback(200);
                } else{
                    callback(500, { Error: 'Could not find check in user object.' });
                }

                // Send response with success status code
                callback(200);
            } catch(err){
                if(err === 'Error deleting file.'){
                    callback(500, { Error: 'Could not delete specified check.' });
                } else if(err === false){
                    callback(403);
                } else if(err === 'Not Found.'){
                    callback(500, { Error: 'Could not find the user that created the check.' });
                } else{
                    callback(400, { Error: 'Could not find specified check.' });
                }
            }
        } else{
            callback(400, { Error: 'Missing required filed.' });
        }
    },
};

// Example error
handlers.exampleError = (data, callback) => {
    const err = new Error('This is an example error');
    throw err;
};

// ping handler
handlers.ping = (data, callback) => {
    callback(200);
};

// Not-found handler
handlers.notFound = (data, callback) => {
    callback(404);
};


// Export handlers
module.exports = handlers;
