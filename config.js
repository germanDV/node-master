/*
 * Create and export env variables
 *
 */

const environments = {
    staging: {
        HTTP_PORT: 3000,
        HTTPS_PORT: 3001,
        ENV_NAME: 'staging',
        HASHING_SECRET: 'Myverysecretstring',
        MAX_CHECKS: 5,
        twilio: {
            accountSid: 'ACb32d411ad7fe886aac54c665d25e5c5d',
            authToken: '9455e3eb3109edc12e3d8c92768f7a67',
            fromPhone: '+15005550006',
        },
        templateGlobals: {
            appName: 'UptimeChecker',
            companyName: 'NotReal, Inc.',
            yearCreated: '2019',
            baseUrl: 'http://localhost:3000/',
        },
    },

    testing: {
        HTTP_PORT: 4000,
        HTTPS_PORT: 4001,
        ENV_NAME: 'testing',
        HASHING_SECRET: 'Myverysecretstring',
        MAX_CHECKS: 5,
        twilio: {
            accountSid: 'ACb32d411ad7fe886aac54c665d25e5c5d',
            authToken: '9455e3eb3109edc12e3d8c92768f7a67',
            fromPhone: '+15005550006',
        },
        templateGlobals: {
            appName: 'UptimeChecker',
            companyName: 'NotReal, Inc.',
            yearCreated: '2019',
            baseUrl: 'http://localhost:4000/',
        },
    },

    production: {
        HTTP_PORT: 5000,
        HTTPS_PORT: 5001,
        ENV_NAME: 'production',
        HASHING_SECRET: 'Myveryverysecretstring',
        MAX_CHECKS: 5,
        twilio: {
            accountSid: '',
            authToken: '',
            fromPhone: '',
        },
        templateGlobals: {
            appName: 'UptimeChecker',
            companyName: 'NotReal, Inc.',
            yearCreated: '2019',
            baseUrl: 'http://localhost:5000/',
        },
    },
};


const currentEnv = process.env.NODE_ENV || '';

const envToExport = typeof environments[currentEnv.toLowerCase()] === 'object'
    ? environments[currentEnv.toLowerCase()]
    : environments.staging;

module.exports = envToExport;
