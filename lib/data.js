/*
 * Library used for storing and editing data
 *
 */

// Dependencies
const fs = require('fs');
const path = require('path');
const helpers = require('./helpers.js');

// Base directory of data folder
const baseDir = path.join(__dirname, '../.data');

// Write to a file
function create(dir, file, data){
    return new Promise((resolve, reject) => {
        // Open file for writing
        fs.open(`${baseDir}/${dir}/${file}.json`, 'wx', (openErr, fileDescriptor) => {
            if(!openErr && fileDescriptor){
                // Convert data to string
                const stringData = JSON.stringify(data);

                // Write to file and close it
                fs.writeFile(fileDescriptor, stringData, (writeErr) => {
                    if(!writeErr){
                        fs.close(fileDescriptor, (closeErr) => {
                            if(!closeErr){
                                resolve('Data written to new file.');
                            } else{
                                reject('Error closing new file.');
                            }
                        });
                    } else{
                        reject('Error writing to new file.');
                    }
                });
            } else{
                reject('Could not create file, it may already exist.');
            }
        });
    });
}

// Read from a file
function read(dir, file){
    return new Promise((resolve, reject) => {
        fs.readFile(`${baseDir}/${dir}/${file}.json`, 'utf-8', (err, data) => {
            err ? reject('Not found.') : resolve(helpers.parseJsonToObj(data));
        });
    });
}

function update(dir, file, data){
    return new Promise((resolve, reject) => {
        // Open file for writing
        fs.open(`${baseDir}/${dir}/${file}.json`, 'r+', (openErr, fileDescriptor) => {
            if(!openErr && fileDescriptor){
                // Convert data to string
                const stringData = JSON.stringify(data);

                // Truncate file before writing new data
                fs.ftruncate(fileDescriptor, (truncError) => {
                    if(!truncError){
                        // Write to file and close it
                        fs.writeFile(fileDescriptor, stringData, (writeErr) => {
                            if(!writeErr){
                                fs.close(fileDescriptor, (closeErr) => {
                                    if(!closeErr){
                                        resolve('Data written to existing file.');
                                    } else{
                                        reject('Error closing file.');
                                    }
                                });
                            } else{
                                reject('Error writing to existing file.');
                            }
                        });
                    } else{
                        reject('Error truncating file.');
                    }
                });
            } else{
                reject('Could not open file for writing, it may not exist.');
            }
        });
    });
}

function del(dir, file){
    return new Promise((resolve, reject) => {
        // Remove file
        fs.unlink(`${baseDir}/${dir}/${file}.json`, (err) => {
            err ? reject('Error deleting file.') : resolve('File deleted.');
        });
    });
}

// List all items in a directory
function list(dir){
    return new Promise((resolve, reject) => {
        fs.readdir(`${baseDir}/${dir}/`, (err, data) => {
            if(!err){
                if(data && data.length > 0){
                    const trimmedFileNames = data.map(fileName => fileName.replace('.json', ''));
                    resolve(trimmedFileNames);
                } else{
                    resolve([]);
                }
            } else{
                reject(err);
            }
        });
    });
}

// Export module
module.exports = {
    create,
    read,
    update,
    del,
    list,
};
