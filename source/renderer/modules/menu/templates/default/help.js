'use strict';

const pjson = require('../../../../../package.json');
const config = require('../../../../../config');

module.exports = {
    getTemplate: function() {
        return {
            100: {
                label: 'HELP.LEARN_MORE',
                click: function() { require('electron').shell.openExternal(config.learnMoreUrl) }
            },
            200: {
                label: 'v' + pjson.version,
                enabled: false
            }
        };
    }
};
