'use strict';

granumNode.factory('Node', [
    function() {
        const ipcRenderer = require('electron').ipcRenderer;

        return {
            getAllNodes: function(path) {
                return new Promise(function(resolve, reject) {
                    function success(event, nodes) {
                        ipcRenderer.removeListener('get-all-nodes-reply-error', failure);
                        resolve(nodes);
                    }
                    function failure(event, error) {
                        ipcRenderer.removeListener('get-all-nodes-reply', success);
                        reject(error);
                    }
                    ipcRenderer.once('get-all-nodes-reply', success);
                    ipcRenderer.once('get-all-nodes-reply-error', failure);
                    ipcRenderer.send('get-all-nodes');
                });
            }
        };
    }]);