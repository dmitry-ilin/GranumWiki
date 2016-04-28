'use strict';

const settings = require('../../../settings');
const Publisher = require('cote').Publisher;

const logger = require('../../../common/logger');

class MediaPublisherProvider {
    constructor() {
        this._name = 'mediaModificationsPublisher';
        this._namespace = 'granumWikiMediaModifications';
        this._broadcasts =  ['mediaCreated', 'mediaUpdated'];
        this._queue = [];
        this._isReady = false;
        this._token = settings.get('node.token');

        settings.on('save', this._settingsUpdated.bind(this));
        this._init();
    }
    _init() {
        this.publisher = new Publisher({
            name: this._name,
            namespace: this._namespace + '[' + this._token + ']',
            broadcasts: this._broadcasts
        }, {
            reuseAddr: true,
            ignoreProcess: true,
            ignoreInstance: true
        });

        this.publisher.on('ready', () => {
            this._onReady();
        });
    }
    reinit() {
        this._isReady = false;
        if (this.publisher) {
            try {
                if (this.publisher.sock) {
                    this.publisher.sock.close();
                }
                this.publisher.close();
            } catch (e) {
                logger.warn(e);
            }
        }
        this._init();
    }
    _settingsUpdated() {
        var newToken = settings.get('node.token');
        if (newToken != this._token) {
            this._token = settings.get('node.token');
            this.reinit();
        }
    }
    _publish(event, data) {
        let publication = {
            event: event,
            data: data
        };

        if (this._isReady) {
            this._sendPublication(publication);
        } else {
            this._queue.push(publication)
        }
    }
    _onReady() {
        logger.info('Publisher [' + this._name + '] is ready');
        this._isReady = true;
        while (this._queue.lenght > 0) {
            this._sendPublication(this._queue.shift());
        }
    }
    _sendPublication(publication) {
        this.publisher.publish(publication.event, publication.data);
    }
    mediaCreated(media) {
        logger.info('Publisher [' + this._name + '] publishes mediaCreated [' + media.uuid + '] ' + media.title);
        this._publish('mediaCreated', media);
    }
    mediaUpdated(media) {
        logger.info('Publisher [' + this._name + '] publishes mediaUpdated [' + media.uuid + '] ' + media.title);
        this._publish('mediaUpdated', media);
    }
}

module.exports = MediaPublisherProvider;
