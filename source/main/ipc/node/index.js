'use strict';

const ipcMain = require('electron').ipcMain;
const requesterProvider = require('../../exchange/requester/node');
const responderProvider = require('../../exchange/responder/node');

const logger = require('../../common/logger');
const NodeIpc = require('./node-ipc');

var nodeIpc = new NodeIpc();

ipcMain.on('get-all-nodes', function(event, data) {
    logger.debug('Starting search for available nodes');
    nodeIpc.getAllNodes().then(function(data) {
        logger.info('Found available nodes: ');
        logger.info(data);
        event.sender.send('get-all-nodes-reply', data);
    });
});

module.exports = nodeIpc;
