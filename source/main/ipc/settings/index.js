'use strict';

const ipcMain = require('electron').ipcMain;
const SettingsIpc = require('./settings-ipc');

const logger = require('../../common/logger');

var settingsIpc = new SettingsIpc();

ipcMain.on('settings-set', function(event, data) {
    settingsIpc.set(data.path, data.value);
    logger.info('Updated config [' + data.path + '] with value [' + JSON.stringify(data.value) + ']');
    event.sender.send('settings-set-reply');
});

ipcMain.on('settings-get', function(event, data) {
    let value = settingsIpc.get(data.path);
    logger.info('Took config [' + data.path + '], it has value [' + JSON.stringify(value) + ']');
    event.sender.send('settings-get-reply', value);
});

module.exports = settingsIpc;
