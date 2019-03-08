/*
 * Example TLS client
 *
 */

// Dependencies
const tls = require('tls');
const fs = require('fs');
const path = require('path');

// Server options
const options = {
    // Only require because we are using self-signed certificate
    ca: fs.readFileSync(path.join(__dirname, '../https/cert.pem')),
};

const outboundMsg = 'ping';

// Create client
const client = tls.connect(6000, options, () => {
    client.write(outboundMsg);
});

// When server responds, log it and kill client
client.on('data', (inboundMsg) => {
    inboundMsg = inboundMsg.toString();
    console.log({
        outboundMsg,
        inboundMsg,
    });

    client.end();
});