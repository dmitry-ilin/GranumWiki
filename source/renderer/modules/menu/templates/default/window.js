'use strict';

const actions = require('../../actions/window');

module.exports = {
    getTemplate: function() {
        var template = {
            100: {
                label: 'WINDOW.MINIMIZE',
                accelerator: 'CmdOrCtrl+M',
                role: 'minimize'
            },
            200: {
                label: 'WINDOW.NEW_WINDOW',
                accelerator: 'CmdOrCtrl+Shift+N',
                click: actions.newWindow
            },
            300: {
                label: 'WINDOW.CLOSE',
                accelerator: 'CmdOrCtrl+W',
                role: 'close'
            }
        };

        if (process.platform == 'darwin') {
            template[400] = {
                type: 'separator'
            };
            template[500] = {
                label: 'DARWIN.BRING_ALL_TO_FRONT',
                role: 'front'
            };
        }

        return template;
    }
};
