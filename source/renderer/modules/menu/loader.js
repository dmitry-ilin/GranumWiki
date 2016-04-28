'use strict';

const templatePath = './templates/';
const i18n = require('../i18n');

module.exports = {
    objectToOrderedArray: function(obj) {
        var arr  = [],
            keys = Object.keys(obj),
            len  = keys.length;

        keys.sort();

        for (let i = 0; i < len; i++) {
            arr.push(obj[keys[i]]);
        }
        return arr;
    },
    loadTemplate: function(path) {
        if (module.exports.hasTemplate(templatePath + path)) {
            var template = require(templatePath + path).getTemplate();
            for (let i in template) {
                if (template[i].label) {
                    template[i].label = i18n.translate(template[i].label);
                }
            }
            return template;
        } else {
            return {};
        }
    },
    loadTemplateAsArray: function(path) {
        return module.exports.objectToOrderedArray(
            module.exports.loadTemplate(path)
        );
    },
    hasTemplate: function(route) {
        try {
            require(route);
            return true;
        } catch (e) {
            console.log(e);
            return false;
        }
    }
};
