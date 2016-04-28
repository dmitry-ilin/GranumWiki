'use strict';

process.setMaxListeners(0);

const electron = require('electron');
const app = electron.app;
const wm = require('./main/common/window-manager');
const Menu = electron.Menu;

var shouldQuit = app.makeSingleInstance(newInstance);
if (shouldQuit) {
    console.log('Another instance of ' + app.getName() + ' is running');
    app.quit();
    return;
}

const bootstrap = require('./main/bootstrap');

function getDockMenu() {
    return Menu.buildFromTemplate([{
        label: 'New Window',
        click: function() {
            newInstance();
        }
    }]);
}

function newInstance() {
    wm.createWindow();
}

app.on('ready', function() {
    if (app.dock) {
        app.dock.setMenu(getDockMenu());
    }

    newInstance();
});
