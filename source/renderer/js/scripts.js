'use strict';

(function() {
    const ipcRenderer = require('electron').ipcRenderer;
    ipcRenderer.on('window-focused', function(event) {
        if (process.platform == 'darwin') {
            require('./modules/menu').updateMenu(
                $('electron-menu-update').attr('route')
            );
        }
    });
})();

$(function() {
    $(window).contextmenu(require('./modules/menu').getContextMenu);
});
