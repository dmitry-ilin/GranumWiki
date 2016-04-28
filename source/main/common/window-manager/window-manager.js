'use strict';

const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const EventEmitter = require('events');
const config = require('../../../config');
const ipcMain = electron.ipcMain;

let windows = {};
let windowFocusPriority = {};

class WindowManager extends EventEmitter {
    constructor() {
        super();

        app.on('window-all-closed', this._closeAllWindowsListener);
        app.on('activate', this._appActivatedListener.bind(this));

        ipcMain.on('create-window', (event) => {
            this.createWindow();
        });
    }

    getInitialSize() {
        let electronScreen = electron.screen;
        let size = electronScreen.getPrimaryDisplay().workAreaSize;

        let width  = Math.round(size.width / config.window.widthInitialRatio);
        let height = Math.round(size.height / config.window.heightInitialRatio);

        if (width > config.window.maxInitialWidth) {
            width = config.window.maxInitialWidth;
        }
        if (height > config.window.maxInitialHeight) {
            height = config.window.maxInitialHeight;
        }

        if (width < config.window.minWidth) {
            width = config.window.minWidth;
        }
        if (height < config.window.minHeight) {
            height = config.window.minHeight;
        }

        return {
            'width': width,
            'height': height
        };
    }

    createWindow() {
        let size = this.getInitialSize();

        let appWindow = new BrowserWindow({
            'width': size.width,
            'height': size.height,
            'min-width': config.window.minHWidth,
            'min-height': config.window.minHeight
        });
        let id = appWindow.id;

        appWindow.loadURL(config.indexFile);

        windows[id] = appWindow;
        // appWindow.webContents.toggleDevTools();
        windowFocusPriority[id] = this._getMaxFocusPriority() + 1;

        appWindow.on('closed', function() {
            delete windows[id];
            delete windowFocusPriority[id];
            appWindow = null;
            id = null;
        });

        appWindow.on('focus', function() {
            appWindow.webContents.send('window-focused');
        });
    }

    _closeAllWindowsListener() {
        if (process.platform !== 'darwin') {
            app.quit();
        }
    }

    _appActivatedListener() {
        if (Object.keys(windows).length <= 0) {
            this.createWindow();
        }
    }

    _getMaxFocusPriority() {
        let priority = 0;
        for (let i in windowFocusPriority) {
            if (windowFocusPriority[i] > priority) {
                priority = windowFocusPriority[i];
            }
        }
        return priority;
    }

    getLastFocusedWindow() {
        let maxPriority = this._getMaxFocusPriority();
        for (let i in windowFocusPriority) {
            if (windowFocusPriority[i] >= maxPriority) {
                return windows[i];
            }
        }
        return null;
    }
}

module.exports = WindowManager;
