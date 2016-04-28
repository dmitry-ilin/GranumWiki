'use strict';

const ipcRenderer = require('electron').ipcRenderer;

module.exports = {
    newWindow: function() {
        ipcRenderer.send('create-window');
    }
};
