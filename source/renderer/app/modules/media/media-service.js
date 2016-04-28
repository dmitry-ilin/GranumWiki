'use strict';

granumMedia.factory('Media', ['ElectronDimmerSaving',
    function(ElectronDimmerSaving) {
        const ipcRenderer = require('electron').ipcRenderer;

        return {
            query: function(searchQuery) {
                return new Promise(function(resolve, reject) {
                    function success(event, mediaItems) {
                        ipcRenderer.removeListener('media-items-find-reply-error', failure);
                        resolve(mediaItems);
                    }
                    function failure(event, error) {
                        ipcRenderer.removeListener('media-items-find-reply', success);
                        reject(error);
                    }
                    ipcRenderer.once('media-items-find-reply', success);
                    ipcRenderer.once('media-items-find-reply-error', failure);
                    ipcRenderer.send('media-items-find-query', {searchQuery: searchQuery});
                });
            },
            get: function(mediaUuid) {
                return new Promise(function(resolve, reject) {
                    function success(event, media) {
                        ipcRenderer.removeListener('media-find-reply-error', failure);
                        resolve(media);
                    }
                    function failure(event, error) {
                        ipcRenderer.removeListener('media-find-reply', success);
                        reject(error);
                    }
                    ipcRenderer.once('media-find-reply', success);
                    ipcRenderer.once('media-find-reply-error', failure);
                    ipcRenderer.send('media-find-query', {uuid: mediaUuid});
                });
            },
            save: function(media) {
                return new Promise(function(resolve, reject) {
                    ElectronDimmerSaving.show();
                    setTimeout(() => {
                        function success(event, media) {
                            ipcRenderer.removeListener('media-save-reply-error', failure);
                            ElectronDimmerSaving.hide();
                            resolve(media);
                        }
                        function failure(event, error) {
                            ipcRenderer.removeListener('media-save-reply', success);
                            ElectronDimmerSaving.hide();
                            reject(error);
                        }
                        ipcRenderer.once('media-save-reply', success);
                        ipcRenderer.once('media-save-reply-error', failure);
                        ipcRenderer.send('media-save-query', media);
                    }, 10);
                });
            }
        };
    }]);
