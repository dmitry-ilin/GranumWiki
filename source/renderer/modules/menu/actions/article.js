'use strict';

const clipboard = require('electron').clipboard;
const angularService = require('../../angular-service');
const ipcRenderer = require('electron').ipcRenderer;

module.exports = {
    editArticle: function() {
        var location = angularService.getService('$location'),
            scope    = angularService.getScope();

        scope.$apply(function(){
            location.url('/article/edit/' + scope.article.uuid);
        });
    },
    saveArticle: function() {
        $('#saveArticle').click();
    },
    newArticle: function() {
        var location = angularService.getService('$location'),
            scope    = angularService.getScope();

        scope.$apply(function(){
            location.url('/article/new');
        });
    },
    copyArticleId: function() {
        clipboard.writeText(angularService.getScope().article.uuid);
    },
    copyArticleUrl: function() {
        var scope = angularService.getScope();

        clipboard.writeText('[' + scope.article.title + '](granum://' + scope.article.uuid + ')');
    },
    syncArticles: function() {
        var route = angularService.getService('$route'),
            scope = angularService.getScope();

        ipcRenderer.once('articles-sync-reply', function(event, articles) {
            scope.$apply(function(){
                route.reload();
            });
        });
        ipcRenderer.send('articles-sync-query');
    }
};
