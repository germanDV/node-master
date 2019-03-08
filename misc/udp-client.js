/*
 * Example UDP client
 *
 */

// Dependencies
const dgram = require('dgram');

// Create the client
const client = dgram.createSocket('udp4');

// Define msg and pull it into bugger
const msgStr = 'This is a message';
const msgBuffer = Buffer.from(msgStr);

// Send the msg
client.send(msgBuffer, 6000, 'localhost', (err) => {
    client.close();
});