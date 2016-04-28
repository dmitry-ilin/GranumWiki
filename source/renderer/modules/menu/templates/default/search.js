'use strict';

const actions = require('../../actions/search');

module.exports = {
    getTemplate: function() {
        return {
            100: {
                label: 'SEARCH.PAGE_SEARCH',
                accelerator: 'CmdOrCtrl+F',
                click: actions.pageSearch
            },
            200: {
                label: 'SEARCH.GLOBAL_SEARCH',
                accelerator: 'Shift+CmdOrCtrl+F',
                click: actions.globalSearch
            }
        };
    }
};
