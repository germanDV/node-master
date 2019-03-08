/*
 * Example TCP (Net) server
 *
 */

// Dependencies
const net = require('net');

// Create server
const server = net.createServer((connection) => {
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