'use strict';

const loader = require('../../../loader');
const actions = require('../../../actions/article');

module.exports = {
    getTemplate: function() {
        return {
            100: {
                label: 'ARTICLE.NEW',
                enabled: true,
                accelerator: 'CmdOrCtrl+N',
                click: actions.newArticle
            },
            200: {
                label: 'ARTICLE.EDIT',
                enabled: false
            },
            300: {
                label: 'ARTICLE.SAVE',
                enabled: true,
                accelerator: 'CmdOrCtrl+S',
                click: actions.saveArticle
            },
            350: {
                type: 'separator'
            },
            400: {
                label: 'ARTICLE.COPY_ID',
                enabled: false
            },
            500: {
                label: 'ARTICLE.COPY_LINK',
                enabled: false
            },
            550: {
                type: 'separator'
            },
            600: {
                label: 'ARTICLE.SYNCHRONIZE_ARTICLES',
                enabled: true,
                click: actions.syncArticles
            }
        };
    }
};
