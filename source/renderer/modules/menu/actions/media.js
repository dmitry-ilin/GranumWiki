'use strict';

const clipboard = require('electron').clipboard;
const angularService = require('../../angular-service');
const ipcRenderer = require('electron').ipcRenderer;

module.exports = {
    editMedia: function() {
        var location = angularService.getService('$location'),
            scope    = angularService.getScope();

        scope.$apply(function(){
            location.url('/media/edit/' + scope.media.uuid);
        });
    },
    saveMedia: function() {
        $('#saveMedia').click();
    },
    newMedia: function() {
        var location = angularService.getService('$location'),
            scope    = angularService.getScope();

        scope.$apply(function(){
            location.url('/media/new');
        });
    },
    copyMediaId: function() {
        clipboard.writeText(angularService.getScope().media.uuid);
    },
    copyMediaCode: function() {
        var scope = angularService.getScope();

        clipboard.writeText('![' + scope.media.title + '](media://' + scope.media.uuid + ')');
    },
    syncMediaItems: function() {
        var route = angularService.getService('$route'),
            scope = angularService.getScope();

        ipcRenderer.once('media-items-sync-reply', function(event, articles) {
            scope.$apply(function(){
                route.reload();
            });
        });
        ipcRenderer.send('media-items-sync-query');
    }
};
