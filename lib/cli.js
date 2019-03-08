/*
 * CLI related tasks
 *
 */

// Dependencies
const readline = require('readline');
const util = require('util');
const events = require('events');
const os = require('os');
const v8 = require('v8');
const childProcess = require('child_process');
const _data = require('./data.js');
const _logs = require('./logs.js');
const helpers = require('./helpers.js');

// Configure logging
const debug = util.debuglog('cli');

// Configure events
class _events extends events{}
const e = new _events();

// Instantiate CLI
const cli = {};

// Input handlers
e.on('man', (str, cb) => cli.responders.help(cb));
e.on('help', (str, cb) => cli.responders.help(cb));
e.on('exit', () => cli.responders.exit());
e.on('stats', (str, cb) => cli.responders.stats(cb));
e.on('list users', (str, cb) => cli.responders.listUsers(cb));
e.on('more user info', (str, cb) => cli.responders.moreUserInfo(str, cb));
e.on('list checks', (str, cb) => cli.responders.listChecks(str, cb));
e.on('more check info', (str, cb) => cli.responders.moreCheckInfo(str, cb));
e.on('list logs', (str, cb) => cli.responders.listLogs(cb));
e.on('more log info', (str, cb) => cli.responders.moreLogInfo(str, cb));

// Responders
cli.responders = {};

// Create a vertical space in the console
cli.verticalSpace = (lines) => {
    lines = typeof lines === 'number' && lines > 0 ? lines : 1;
    for(let i = 0; i < lines; i++){
        console.log('');
    }
};

// Create horizontal line
cli.horizontalLine = () => {
    // Get screen size
    const width = process.stdout.columns;

    let line = '';
    for(let i = 0; i < width; i++){
        line += '-';
    }
    console.log(line);
};

// Display centered text in the console
cli.centered = (str) => {
    str = typeof str === 'string' && str.trim().length > 0
        ? str.trim()
        : '';

    // Get screen size
    const width = process.stdout.columns;

    // Calculate left padding
    const leftPadding = Math.floor((width - str.length) / 2);

    // Put in spaces before the str
    let line = '';
    for(let i = 0; i < leftPadding; i++){
        line += ' ';
    }
    line += str;

    console.log(line);
};

// Help / Man
cli.responders.help = (cb) => {
    const commands = {
        'exit': 'Kill the CLI and the rest of the application',
        'man': 'Show this help page',
        'help': 'Alias of the "man" command',
        'stats': 'Get statistics on the underlying OS and resources utilized',
        'list users': 'Show a list of all registered (undeleted) users',
        'more user info --<userId>': 'Show details of a specific user',
        'list checks --up --down': 'Show a list of all checks in the system (op. --up and --down)',
        'more check info --<checkId>': 'Show details of a specific check',
        'list logs': 'Show a list of all the log files available (compressed only)',
        'more log info --<logId>': 'Show details of a specific log',
    };

    // Show a header for the help page
    cli.horizontalLine();
    cli.centered('CLI MANUAL');
    cli.horizontalLine();
    cli.verticalSpace(2);

    // Show each command
    for(const key in commands){
        if(commands.hasOwnProperty(key)){
            const value = commands[key];
            let line = `\x1b[33m${key}\x1b[0m`;
            const padding = 60 - line.length;

            for(let i = 0; i < padding; i++){
                line += ' ';
            }

            line += value;
            console.log(line);
            cli.verticalSpace();
        }
    }

    cli.verticalSpace();
    cli.horizontalLine();
    cb();
};

cli.responders.exit = () => {
    console.log('Goodbye!');
    process.exit(0);
};

cli.responders.stats = (cb) => {
    // Compile an object of stats
    const stats = {
        'Load Average': os.loadavg().join(' '),
        'CPU Count': os.cpus().length,
        'Free Memory': os.freemem(),
        'Current Malloced Memory': v8.getHeapStatistics().malloced_memory,
        'Peak Malloced Memory': v8.getHeapStatistics().peak_malloced_memory,
        'Allocated Heap Used (%)': Math.round((v8.getHeapStatistics().used_heap_size / v8.getHeapStatistics().total_heap_size) * 100),
        'Available Heap Allocated (%)': Math.round((v8.getHeapStatistics().total_heap_size / v8.getHeapStatistics().heap_size_limit) * 100),
        'Uptime (seconds)': os.uptime(),
    };

    // Show a header for the help page
    cli.horizontalLine();
    cli.centered('SYSTEM STATISTICS');
    cli.horizontalLine();
    cli.verticalSpace(2);

    // Show each command
    for(const key in stats){
        if(stats.hasOwnProperty(key)){
            const value = stats[key];
            let line = `\x1b[33m${key}\x1b[0m`;
            const padding = 60 - line.length;

            for(let i = 0; i < padding; i++){
                line += ' ';
            }

            line += value;
            console.log(line);
            cli.verticalSpace();
        }
    }

    cli.verticalSpace(1);
    cli.horizontalLine();
    cb();
};

cli.responders.listUsers = async(cb) => {
    try{
        const userIds = await _data.list('users');

        cli.verticalSpace();

        for(const userId of userIds){
            const userData = await _data.read('users', userId);

            let line = `Name: ${userData.firstName} ${userData.lastName}`;
            line += ` Phone: ${userData.phone}`;

            let numberOfChecks = typeof userData.checks === 'object' && userData.checks instanceof Array && userData.checks.length > 0
                ? userData.checks.length
                : 0;

            line += ` Checks: ${numberOfChecks}`;
            console.log(line);
            cli.verticalSpace();
        }
    } catch(err){
        debug('No users found');
    } finally{
        cb();
    }
};

cli.responders.moreUserInfo = async(str, cb) => {
    // Get the ID from the string
    const arr = str.split('--');
    const userId = typeof arr[1] === 'string' && arr[1].trim().length > 0
        ? arr[1].trim()
        : false;

    if(userId){
        try{
            const userData = await _data.read('users', userId);

            // Removed password
            delete userData.hashedPassword;

            // Print user data
            cli.verticalSpace();
            console.dir(userData, { colors: true });
            cli.verticalSpace();
        } catch(err){
            debug(err);
        } finally{
            cb();
        }
    }
};

cli.responders.listChecks = async(str, cb) => {
    try{
        const checkIds = await _data.list('checks');

        cli.verticalSpace();

        for(const checkId of checkIds){
            const checkData = await _data.read('checks', checkId);
            str = str.toLowerCase();

            // Get state of the check, default to down
            const state = typeof checkData.state === 'string' ? checkData.state : 'down';

            if(str.indexOf(`--${state}`) > -1 || str.indexOf('--') === -1){
                let line = `ID: ${checkData.id}`;
                line += ` ${checkData.method.toUpperCase()}`;
                line += ` ${checkData.protocol}://${checkData.url}`;
                line += ` State: ${checkData.state}`;
                console.log(line);
                cli.verticalSpace();
            }
        }
    } catch(err){
        debug(err);
    } finally{
        cb();
    }
};

cli.responders.moreCheckInfo = async(str, cb) => {
    // Get the ID from the string
    const arr = str.split('--');
    const checkId = typeof arr[1] === 'string' && arr[1].trim().length > 0
        ? arr[1].trim()
        : false;

    if(checkId){
        try{
            const checkData = await _data.read('checks', checkId);

            // Print user data
            cli.verticalSpace();
            console.dir(checkData, { colors: true });
            cli.verticalSpace();
        } catch(err){
            debug(err);
        } finally{
            cb();
        }
    }
};

cli.responders.listLogs = async(cb) => {
    const ls = childProcess.spawn('ls', ['./.logs/']);
    ls.stdout.on('data', (dataObj) => {
        const dataStr = dataObj.toString();
        const logFileNames = dataStr.split('\n');

        cli.verticalSpace();
        for(const logFileName of logFileNames){
            // Only list files that have been compressed
            if(typeof logFileName === 'string' && logFileName.indexOf('-') > -1){
                console.log(logFileName.trim().split('.')[0]);
                cli.verticalSpace();
            }
        }

        cb();
    });
};

cli.responders.moreLogInfo = async(str, cb) => {
    // Get the logFileName from the string
    const arr = str.split('--');
    const logFileName = typeof arr[1] === 'string' && arr[1].trim().length > 0
        ? arr[1].trim()
        : false;

    if(logFileName){
        try{
            cli.verticalSpace();

            // Decompress the log file
            const strData = await _logs.decompress(logFileName);

            // Split into lines
            const arrOfJsonStrs = strData.split('\n');
            for(const jsonStr of arrOfJsonStrs){
                const logObj = helpers.parseJsonToObj(jsonStr);
                if(logObj && JSON.stringify(logObj) !== '{}'){
                    console.dir(logObj, { colors: true });
                    cli.verticalSpace();
                }
            }
        } catch(err){
            debug(err);
        } finally{
            cb();
        }
    }
};

// Input processor
cli.processInput = (str, cb) => {
    str = typeof str === 'string' && str.trim().length > 0
        ? str.trim()
        : false;

    if(str){
        // Configure the possible commands
        const uniqueInputs = [
            'man',
            'help',
            'exit',
            'stats',
            'list users',
            'more user info',
            'list checks',
            'more check info',
            'list logs',
            'more log info',
        ];

        // Try to match the user input and emit and event
        let matchFound = false;
        uniqueInputs.some((input) => {
            if(str.toLowerCase().indexOf(input) > -1){
                matchFound = true;

                // Emit event with the full string
                e.emit(input, str, cb);

                return true; // array.some() checks if at least 1 is true, this interrumpts the loop
            }
        });

        // If not match, tell user to try again
        if(!matchFound){
            console.log('Sorry, try again.');
            cb();
        }
    }
};

// Init script
cli.init = () => {
    // Send start message to the console
    console.log('\x1b[34m%s\x1b[0m', 'The CLI is running...');

    // Start the interface
    const _interface = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        prompt: '',
    });

    // Create the prompt
    _interface.prompt();

    // Handle each line of input separately
    _interface.on('line', (str) => {
        // Send to the input processor with a callback to re-initialize the prompt
        cli.processInput(str, () => _interface.prompt());
    });

    // User kills the CLI
    _interface.on('close', () => process.exit(0));
};


// Export CLI
module.exports = cli;
