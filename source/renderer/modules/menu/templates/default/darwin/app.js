'use strict';

module.exports = {
    getTemplate: function() {
        return {
            100: {
                label: 'DARWIN.ABOUT ' + name,
                role: 'about'
            },
            200: {
                type: 'separator'
            },
            300: {
                label: 'DARWIN.SERVICES',
                role: 'services',
                submenu: []
            },
            400: {
                type: 'separator'
            },
            500: {
                label: 'DARWIN.HIDE ' + name,
                accelerator: 'Command+H',
                role: 'hide'
            },
            600: {
                label: 'DARWIN.HIDE_OTHERS',
                accelerator: 'Command+Alt+H',
                role: 'hideothers'
            },
            700: {
                label: 'DARWIN.SHOW_ALL',
                role: 'unhide'
            },
            800: {
                type: 'separator'
            },
            900: {
                label: 'DARWIN.QUIT',
                accelerator: 'Command+Q',
                click: function() { app.quit(); }
            }
        };
    }
};
