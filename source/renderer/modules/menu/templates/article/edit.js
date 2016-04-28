'use strict';

const loader = require('../../loader');


module.exports = {
    getTemplate: function() {
        var template = loader.loadTemplate('default');

        template[200] = {
            label: 'ARTICLE.ARTICLE',
            submenu: loader.loadTemplateAsArray('article/edit/article')
        };

        return template;
    }
};
