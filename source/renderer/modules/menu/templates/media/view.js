'use strict';

const loader = require('../../loader');


module.exports = {
    getTemplate: function() {
        var template = loader.loadTemplate('default');

        template[250] = {
            label: 'MEDIA.MEDIA',
            submenu: loader.loadTemplateAsArray('media/view/media')
        };

        return template;
    }
};
