/*
 * Example TCP (Net) client
 *
 */

// Dependencies
const net = require('net');

const outboundMsg = 'ping';

// Create client
const client = net.createConnection({ port: 6000 }, () => {
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