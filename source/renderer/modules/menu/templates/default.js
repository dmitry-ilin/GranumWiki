'use strict';

const loader = require('../loader');
const config = require('../../../../config');

module.exports = {
    getTemplate: function() {
        var template = {
            200: {
                label: 'ARTICLE.ARTICLE',
                submenu: loader.loadTemplateAsArray('default/article')
            },
            250: {
                label: 'MEDIA.MEDIA',
                submenu: loader.loadTemplateAsArray('default/media')
            },
            300: {
                label: 'EDIT.EDIT',
                submenu: loader.loadTemplateAsArray('default/edit')
            },
            350: {
                label: 'SEARCH.SEARCH',
                submenu: loader.loadTemplateAsArray('default/search')
            },
            500: {
                label: 'WINDOW.WINDOW',
                role: 'window',
                submenu: loader.loadTemplateAsArray('default/window')
            },
            600: {
                label: 'HELP.HELP',
                role: 'help',
                submenu: loader.loadTemplateAsArray('default/help')
            }
        };

        if (config.developerMode) {
            template[400] = {
                label: 'VIEW.VIEW',
                submenu: loader.loadTemplateAsArray('default/view')
            };
        }

        if (process.platform == 'darwin') {
            var name = require('electron').remote.app.getName();
            template[100] = {
                label: name,
                submenu: loader.loadTemplateAsArray('default/darwin/app')
            };
        }

        return template;
    }
};
