'use strict';

module.exports = {
    getTemplate: function() {
        return {
            100: {
                label: 'EDIT.UNDO',
                accelerator: 'CmdOrCtrl+Z',
                role: 'undo'
            },
            200: {
                label: 'EDIT.REDO',
                accelerator: 'Shift+CmdOrCtrl+Z',
                role: 'redo'
            },
            300: {
                type: 'separator'
            },
            400: {
                label: 'EDIT.CUT',
                accelerator: 'CmdOrCtrl+X',
                role: 'cut'
            },
            500: {
                label: 'EDIT.COPY',
                accelerator: 'CmdOrCtrl+C',
                role: 'copy'
            },
            600: {
                label: 'EDIT.PASTE',
                accelerator: 'CmdOrCtrl+V',
                role: 'paste'
            },
            700: {
                label: 'EDIT.SELECT_ALL',
                accelerator: 'CmdOrCtrl+A',
                role: 'selectall'
            }
        };
    }
};
