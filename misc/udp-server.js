/*
 * Example UDP server
 *
 */

// Dependencies
const dgram = require('dgram');

// Create server
const server = dgram.createSocket('udp4');

server.on('message', (messageBuffer, sender) => {
    const msgStr = messageBuffer.toString();
    console.log(msgStr);
});

server.bind(6000);