'use strict';

const ElectronSettings = require('electron-settings');
const defaults = require('./defaults');

var settings = new ElectronSettings();
if (Object.keys(settings.get('.')).length === 0) {
    settings.set('.', require('./defaults'));
}

function setDefaultsIfNull() {
    var currentSettings = settings.get('.');
    for (let i in defaults) {
        if (!currentSettings[i]) {
            settings.set(i, defaults[i]);
        } else {
            for (let j in defaults[i]) {
                if (!currentSettings[i][j]) {
                    settings.set(i + '.' + j, defaults[i][j]);
                }
            }
        }
    }
}

setDefaultsIfNull();

settings.setMaxListeners(100)
settings.on('save', function() {
    setDefaultsIfNull();
});

module.exports = settings;
