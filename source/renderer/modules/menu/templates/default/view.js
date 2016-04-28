'use strict';

module.exports = {
    getTemplate: function() {
        return {
            100: {
            label: 'VIEW.RELOAD',
                accelerator: 'CmdOrCtrl+R',
                click: function(item, focusedWindow) {
                if (focusedWindow)
                    focusedWindow.reload();
                }
            },
            200: {
                label: 'VIEW.TOGGLE_FULL_SCREEN',
                    accelerator: (function() {
                    if (process.platform == 'darwin')
                        return 'Ctrl+Command+F';
                    else
                        return 'F11';
                })(),
                    click: function(item, focusedWindow) {
                    if (focusedWindow)
                        focusedWindow.setFullScreen(!focusedWindow.isFullScreen());
                }
            },
            300: {
                label: 'VIEW.TOGGLE_DEVELOPER_TOOLS',
                    accelerator: (function() {
                    if (process.platform == 'darwin')
                        return 'Alt+Command+I';
                    else
                        return 'Ctrl+Shift+I';
                })(),
                    click: function(item, focusedWindow) {
                    if (focusedWindow)
                        focusedWindow.toggleDevTools();
                }
            }
        };
    }
};
