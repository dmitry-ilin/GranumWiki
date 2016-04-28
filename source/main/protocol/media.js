'use strict';

const electron = require('electron');
const app = electron.app;
const path = require('path');

const mimeType = require('../../shared/media/mime-type');
const logger = require('../common/logger');
const mediaIpc = require('../ipc/media');

app.on('ready', function() {
    var protocol = electron.protocol;
    protocol.registerStandardSchemes(['media']);
    protocol.registerBufferProtocol('media', function(request, callback) {

        var url = request.url.substr(8);

        mediaIpc.mediaFind(
            url,
            function(media) {
                callback({
                    mimeType: mimeType(media.content, 'text/html'),
                    data: new Buffer(media.content)
                });
            },
            function(error) {
                callback({
                    mimeType: 'text/html',
                    data: new Buffer('Error')
                });
            }
        );

    }, function (error) {
        if (error) {
            logger.fatal('Failed to register media protocol');
        }
    });
});
