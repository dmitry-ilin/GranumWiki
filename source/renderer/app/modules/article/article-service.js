'use strict';

granumArticle.factory('Article', ['ElectronDimmerSaving',
    function(ElectronDimmerSaving) {
        const ipcRenderer = require('electron').ipcRenderer;

        return {
            query: function(searchQuery) {
                return new Promise(function(resolve, reject) {
                    function success(event, articles) {
                        ipcRenderer.removeListener('articles-find-reply-error', failure);
                        resolve(articles);
                    }
                    function failure(event, error) {
                        ipcRenderer.removeListener('articles-find-reply', success);
                        reject(error);
                    }
                    ipcRenderer.once('articles-find-reply', success);
                    ipcRenderer.once('articles-find-reply-error', failure);
                    ipcRenderer.send('articles-find-query', {searchQuery: searchQuery});
                });
            },
            queryByMedia: function(media) {
                return new Promise(function(resolve, reject) {
                    function success(event, articles) {
                        ipcRenderer.removeListener('articles-find-by-media-reply-error', failure);
                        resolve(articles);
                    }
                    function failure(event, error) {
                        ipcRenderer.removeListener('articles-find-by-media-reply', success);
                        reject(error);
                    }
                    ipcRenderer.once('articles-find-by-media-reply', success);
                    ipcRenderer.once('articles-find-by-media-reply-error', failure);
                    ipcRenderer.send('articles-find-by-media-query', {uuid: media.uuid});
                });
            },
            get: function(articleUuid) {
                return new Promise(function(resolve, reject) {
                    function success(event, article) {
                        ipcRenderer.removeListener('article-find-reply-error', failure);
                        resolve(article);
                    }
                    function failure(event, error) {
                        ipcRenderer.removeListener('article-find-reply', success);
                        reject(error);
                    }
                    ipcRenderer.once('article-find-reply', success);
                    ipcRenderer.once('article-find-reply-error', failure);
                    ipcRenderer.send('article-find-query', {uuid: articleUuid});
                });
            },
            save: function(article) {
                return new Promise(function(resolve, reject) {
                    ElectronDimmerSaving.show();
                    setTimeout(() => {
                        function success(event, article) {
                            ipcRenderer.removeListener('article-save-reply-error', failure);
                            ElectronDimmerSaving.hide();
                            resolve(article);
                        }
                        function failure(event, error) {
                            ipcRenderer.removeListener('article-save-reply', success);
                            ElectronDimmerSaving.hide();
                            reject(error);
                        }
                        ipcRenderer.once('article-save-reply', success);
                        ipcRenderer.once('article-save-reply-error', failure);
                        ipcRenderer.send('article-save-query', article);
                    }, 10);
                });
            }
        };
    }]);
