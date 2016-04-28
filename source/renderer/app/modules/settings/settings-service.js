'use strict';

granumSettings.factory('Settings', [
    function() {
        const ipcRenderer = require('electron').ipcRenderer;

        return {
            get: function(path) {
                return new Promise(function(resolve, reject) {
                    function success(event, settings) {
                        ipcRenderer.removeListener('settings-get-reply-error', failure);
                        resolve(settings);
                    }
                    function failure(event, error) {
                        ipcRenderer.removeListener('settings-get-reply', success);
                        reject(error);
                    }
                    ipcRenderer.once('settings-get-reply', success);
                    ipcRenderer.once('settings-get-reply-error', failure);
                    ipcRenderer.send('settings-get', {
                        path: path
                    });
                });
            },
            set: function(path, value) {
                return new Promise(function(resolve, reject) {
                    function success(event) {
                        ipcRenderer.removeListener('settings-set-reply-error', failure);
                        resolve();
                    }
                    function failure(event, error) {
                        ipcRenderer.removeListener('settings-set-reply', success);
                        reject(error);
                    }
                    ipcRenderer.once('settings-set-reply', success);
                    ipcRenderer.once('settings-set-reply-error', failure);
                    ipcRenderer.send('settings-set', {
                        path: path,
                        value: value
                    });
                });
            }
        };
    }]);