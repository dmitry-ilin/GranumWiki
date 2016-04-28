'use strict';

const settings = require('../../../settings');
const Subscriber = require('cote').Subscriber;
const Media = require('../../../db/model/media');

const logger = require('../../../common/logger');

class MediaSubscriberProvider {
    constructor() {
        this._name = 'mediaModificationsSubscriber';
        this._namespace = 'granumWikiMediaModifications';
        this._subscribesTo = ['mediaCreated', 'mediaUpdated'];
        this._token = settings.get('node.token');

        settings.on('save', this._settingsUpdated.bind(this));
        this._init();
    }
    _init() {
        this.subscriber = new Subscriber({
            name: this._name,
            namespace: this._namespace + '[' + this._token + ']',
            subscribesTo: this._subscribesTo
        }, {
            reuseAddr: true,
            ignoreProcess: true,
            ignoreInstance: true
        });

        this.subscriber.on('ready', () => {
            this._onReady();
        });

        this.subscriber.on('mediaCreated', this.mediaCreated);
        this.subscriber.on('mediaUpdated', this.mediaUpdated);
    }
    reinit() {
        this._isReady = false;
        if (this.subscriber) {
            try {
                if (this.subscriber.sock) {
                    this.subscriber.sock.close();
                }
                this.subscriber.close();
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
    _onReady() {
        logger.info('Subscriber [' + this._name + '] is ready');
        this._isReady = true;
    }
    mediaCreated(media) {
        Media
            .find({
                where: { uuid: media.uuid }
            })
            .then(function(localMedia) {
                if (!localMedia) {
                    Media
                        .create(media)
                        .then((media) => {
                            logger.info('Media created via network: ', media);
                        })
                        .catch((err) => { logger.error(err) });
                } else {
                    logger.error('Duplicated media UUID [' + media.uuid + ']');
                }
            })
            .catch((err) => { logger.error(err) });
    }
    mediaUpdated(media) {
        Media
            .find({
                where: { uuid: media.uuid }
            })
            .then(function(localMedia) {
                if (!localMedia) {
                    Media
                        .create(media)
                        .then((media) => {
                            logger.info('Media updated (created) via network: ', media);
                        })
                        .catch((err) => { logger.error(err) });
                } else {
                    let localMediaCreatedAt = (new Date(localMedia.created_at)).getTime(),
                        mediaCreatedAt = (new Date(media.created_at)).getTime(),
                        localMediaUpdatedAt = (new Date(localMedia.updated_at)).getTime(),
                        mediaUpdatedAt = (new Date(media.updated_at)).getTime();

                    if (
                        localMediaCreatedAt == mediaCreatedAt &&
                        localMediaUpdatedAt < mediaUpdatedAt &&
                        localMedia.version < media.version
                    ) {
                        localMedia
                            .update(media)
                            .then((media) => {
                                logger.info('Media updated via network: ', media);
                            })
                            .catch((err) => { logger.error(err) })
                    } else {
                        logger.error('Cannot update media: ' + media.uuid);
                    }
                }
            })
            .catch((err) => { logger.error(err) });
    }
}

module.exports = MediaSubscriberProvider;
