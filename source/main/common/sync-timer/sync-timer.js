'use strict';

const settings = require('../../settings');
const settingsIpc = require('../../ipc/settings');
const articleIpc = require('../../ipc/article');
const mediaIpc = require('../../ipc/media');
const requesterProvider = require('../../exchange/requester/article');

class SyncTimer {
    constructor() {
        this.syncInterval = null;
        this.frequency = null;
        this._startupDelay = 5000;

        this.initStartupSync();
        this.initScheduledSync();

        settings.on('save', this.settingsUpdated.bind(this));
    }
    settingsUpdated() {
        var newFrequency = settings.get('synchronization.frequency');
        if (newFrequency != this.frequency) {
            this.stopScheduledSync();
            this.startScheduledSync(newFrequency);
        }
    }
    initStartupSync() {
        if (parseInt(settings.get('synchronization.startup'))) {
            requesterProvider.requester.once('ready', () => {
                setTimeout(function() {
                    articleIpc.articlesSync();
                    mediaIpc.mediaItemsSync();
                }, this._startupDelay);
            });
        }
    }
    initScheduledSync() {
        this.startScheduledSync(
            parseInt(settings.get('synchronization.frequency'))
        );
    }
    startScheduledSync(frequency) {
        if (frequency > 0) {
            this.frequency = frequency;
            this.syncInterval = setInterval(function() {
                articleIpc.articlesSync();
                mediaIpc.mediaItemsSync();
            }, this.frequency * 60 * 1000); // Minutes
        }
    }
    stopScheduledSync() {
        clearInterval(this.syncInterval);
    }
}

module.exports = SyncTimer;
