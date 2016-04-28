'use strict';

const remote = require('electron').remote;
const Menu = remote.Menu;
const helper = require('./loader');


module.exports = {
    getMenu: function(route) {
        var template = helper.loadTemplateAsArray(route);

        if (template.length <= 0) {
            template = helper.loadTemplateAsArray('default');
        }

        return Menu.buildFromTemplate(template);
    },
    updateMenu: function(route) {
        if (process.platform == "darwin") {
            Menu.setApplicationMenu(
                module.exports.getMenu(route)
            );
        } else {
            remote.getCurrentWindow().setMenu(
                module.exports.getMenu(route)
            );
        }
    },
    getContextMenu: function(event) {
        event.preventDefault();
        var template = helper.loadTemplateAsArray('default/edit');
        var menu = Menu.buildFromTemplate(template);

        menu.popup(remote.getCurrentWindow());
    }
};
