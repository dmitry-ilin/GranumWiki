'use strict';

const loader = require('../../../loader');
const actions = require('../../../actions/media');

module.exports = {
    getTemplate: function() {
        return {
            100: {
                label: 'MEDIA.NEW',
                enabled: true,
                accelerator: 'CmdOrCtrl+J',
                click: actions.newMedia
            },
            200: {
                label: 'MEDIA.EDIT',
                enabled: true,
                accelerator: 'CmdOrCtrl+E',
                click: actions.editMedia
            },
            300: {
                label: 'MEDIA.SAVE',
                enabled: false
            },
            350: {
                type: 'separator'
            },
            400: {
                label: 'MEDIA.COPY_ID',
                enabled: true,
                click: actions.copyMediaId
            },
            500: {
                label: 'MEDIA.COPY_CODE',
                enabled: true,
                accelerator: 'CmdOrCtrl+Shift+C',
                click: actions.copyMediaCode
            },
            550: {
                type: 'separator'
            },
            600: {
                label: 'MEDIA.SYNCHRONIZE_MEDIA_ITEMS',
                enabled: true,
                click: actions.syncMediaItems
            }
        };
    }
};
