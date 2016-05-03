'use strict';

const ipcMain = require('electron').ipcMain;

const logger = require('../../common/logger');
const MediaIpc = require('./media-ipc');

var mediaIpc = new MediaIpc();

ipcMain.on('media-items-find-query', function(event, data) {

    mediaIpc.mediaItemsFind(
        data.searchQuery,
        true,
        function(mediaItems) {
            logger.info('Media items found:');
            for (let i = 0; i < mediaItems.length; i++) {
                logger.info('[' + mediaItems[i].uuid + '] ' + mediaItems[i].title);
            }

            event.sender.send('media-items-find-reply', mediaItems);
        },
        function(err) {
            logger.error(err);
            event.sender.send('media-items-find-reply-error', err);
        }
    );
});

ipcMain.on('media-find-query', function(event, data) {

    mediaIpc.mediaFind(
        data.uuid,
        function(media) {
            if (media) {
                logger.info('Media found: [' + media.uuid + '] ' + media.title);
                event.sender.send('media-find-reply', media.get({
                    plain: true
                }));
            } else {
                logger.info('Media not found: [' + data.uuid + ']');
                event.sender.send('media-find-reply-error', { 'not_found': true });
            }
        },
        function(err) {
            logger.error(err);
            event.sender.send('media-find-reply-error', err);
        }
    )
});

ipcMain.on('media-save-query', function(event, data) {

    var updateQuery = (data.uuid) ? true : false;

    function success(media) {
        event.sender.send('media-save-reply', media.get({
            plain: true
        }));
    }

    function failure(err) {
        logger.error(err);
        event.sender.send('media-save-reply-error', err);
    }

    if (updateQuery) {
        mediaIpc.mediaUpdate(data, success, failure);
    } else {
        mediaIpc.mediaCreate(data, success, failure);
    }
});

ipcMain.on('media-items-sync-query', function(event, data) {

    mediaIpc.mediaItemsSync(
        function(synced) {
            logger.info('Media items synced:');
            logger.info(synced);
            event.sender.send('media-items-sync-reply', {
                synced: synced
            });
        },
        function(err) {
            logger.error(err);
            event.sender.send('media-items-sync-reply-error', err);
        }
    )
});

module.exports = mediaIpc;
