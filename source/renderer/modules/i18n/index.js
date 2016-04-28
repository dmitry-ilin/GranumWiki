'use strict';

const clipboard = require('electron').clipboard;
const angularService = require('../angular-service');

module.exports = {
    translate: function(text) {
        return angularService.getService('$translate').instant(text);
    }
};
