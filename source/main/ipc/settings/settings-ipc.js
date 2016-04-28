'use strict';

const settings = require('../../settings');

class SettingsIpc {
    constructor() {
        this._settings = settings;
    }
    set (path, value) {
        return this._settings.set(path, value);
    }
    get (path) {
        return this._settings.get(path)
    }
};

module.exports = SettingsIpc;
