/*
 * Example TLS server
 *
 */

// Dependencies
const tls = require('tls');
const fs = require('fs');
const path = require('path');

// Server options
const options = {
    key: fs.readFileSync(path.join(__dirname, '../https/key.pem')),
    cert: fs.readFileSync(path.join(__dirname, '../https/cert.pem')),
};

// Create server
const server = tls.createServer(options, (connection) => {
    const outboundMsg = 'pong';
    connection.write(outboundMsg);

    // When client writes something, log it
    connection.on('data', (inboundMsg) => {
        inboundMsg = inboundMsg.toString();
        console.log({
            outboundMsg,
            inboundMsg,
        })
    });
});

server.listen(6000);