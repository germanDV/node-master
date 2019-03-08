/*
 * Library used for handling log files
 *
 */

// Dependencies
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

// Base directory of data folder
const baseDir = path.join(__dirname, '../.logs');

// Append string to file, create file if it does not exist.
function append(file, str){
    return new Promise((resolve, reject) => {
        // Open the file for appending
        fs.open(`${baseDir}/${file}.log`, 'a', (err, fileDescriptor) => {
            if(!err && fileDescriptor){
                // Append to file and close it
                fs.appendFile(fileDescriptor, `${str}\n`, (err) => {
                    if(!err){
                        fs.close(fileDescriptor, (err) => {
                            if(!err){
                                resolve('Log appending to file.');
                            } else{
                                reject('Error closing file.');
                            }
                        });
                    } else{
                        reject('Error appending to file.');
                    }
                });
            } else{
                reject('Could not open file for appending.');
            }
        });
    });
}

// List all the logs, optionally include compressed logs
function list(includeCompressedLogs){
    return new Promise((resolve, reject) => {
        fs.readdir(baseDir, (err, data) => {
            if(!err){
                if(data && data.length > 0){
                    const trimmedFileNames = [];
                    data.forEach((fileName) => {
                        // Add the .log files (non-compressed)
                        if(fileName.indexOf('.log') > -1){
                            trimmedFileNames.push(fileName.replace('.log', ''));
                        }

                        // Add the compressed file (if requested)
                        if(fileName.indexOf('.gz.b64') > -1 && includeCompressedLogs){
                            trimmedFileNames.push(fileName.replace('.gz.b64', ''));
                        }
                    });
                    resolve(trimmedFileNames);
                } else{
                    reject('No log files were found.');
                }
            } else{
                reject(err);
            }
        });
    });
}

// Compress the contents of a .log file into a .gz.b64 file
function compress(logId, newFileId){
    return new Promise((resolve, reject) => {
        const sourceFile = `${logId}.log`;
        const destFile = `${newFileId}.gz.b64`;

        // Read the source file
        fs.readFile(`${baseDir}/${sourceFile}`, 'utf-8', (err, inputString) => {
            if(!err && inputString){
                // Compress data using gzip
                zlib.gzip(inputString, (err, buffer) => {
                    if(!err && buffer){
                        // Send compressed data to destination file
                        fs.open(`${baseDir}/${destFile}`, 'wx', (err, fileDescriptor) => {
                            if(!err && fileDescriptor){
                                // Write to destination file
                                fs.writeFile(fileDescriptor, buffer.toString('base64'), (err) => {
                                    if(!err){
                                        // Close destination file
                                        fs.close(fileDescriptor, (err) => {
                                            if(!err){
                                                resolve('Compressed log file succesfully.');
                                            } else{
                                                reject(err);
                                            }
                                        });
                                    } else{
                                        reject(err);
                                    }
                                });
                            } else{
                                reject(err);
                            }
                        });
                    } else{
                        reject(err);
                    }
                });
            } else{
                reject(err);
            }
        });
    });
}

// Decompress a .gz.b64 file
function decompress(fileId){
    return new Promise((resolve, reject) => {
        const fileName = `${fileId}.gz.b64`;
        fs.readFile(`${baseDir}/${fileName}`, 'utf-8', (err, str) => {
            if(!err && str){
                // Decompress data
                const inputBuffer = Buffer.from(str, 'base64');
                zlib.unzip(inputBuffer, (err, outputBuffer) => {
                    if(!err && outputBuffer){
                        resolve(outputBuffer.toString());
                    } else{
                        reject(err);
                    }
                });
            } else{
                reject(err);
            }
        });
    });
}

function truncate(logId){
    return new Promise((resolve, reject) => {
        fs.truncate(`${baseDir}/${logId}.log`, 0, (err) => {
            err ? reject(err) : resolve('Log file truncated.');
        });
    });
}

module.exports = {
    append,
    list,
    compress,
    decompress,
    truncate,
};
