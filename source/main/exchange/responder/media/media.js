'use strict';

const settings = require('../../../settings');
const Responder = require('cote').Responder;
const Media = require('../../../db/model/media');
const MediaChecksum = require('../../../db/model/media-checksum');

const logger = require('../../../common/logger');

class MediaResponderProvider {
    constructor() {
        this._name = 'mediaResponder';
        this._namespace = 'granumWikiMedia';
        this._respondsTo = ['mediaByUuid', 'mediaByChecksum', 'allMediaChecksums'];
        this._token = settings.get('node.token');

        this._isReady = false;
        settings.on('save', this._settingsUpdated.bind(this));
        this._init();
    }
    _init() {
        this.responder = new Responder({
            name: this._name,
            namespace: this._namespace + '[' + this._token + ']',
            respondsTo: this._respondsTo
        }, {
            reuseAddr: true,
            ignoreProcess: true,
            ignoreInstance: true
        });

        this.responder.on('ready', () => {
            this._onReady();
        });

        this.responder.on('mediaByUuid', this.mediaByUuid.bind(this));
        this.responder.on('mediaByChecksum', this.mediaByChecksum.bind(this));
        this.responder.on('allMediaChecksums', this.allMediaChecksums.bind(this));
    }
    reinit() {
        this._isReady = false;
        if (this.responder) {
            try {
                if (this.responder.sock) {
                    this.responder.sock.close();
                }
                this.responder.close();
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
        logger.info('Responder [' + this._name + '] is ready');
        this._isReady = true;
    }
    mediaByUuid(request, callback) {
        var self = this;
        var uuid = request.data.uuid;

        var responderUuid = this.getResponderUuid();

        Media
            .find({
                where: {
                    uuid: uuid
                }
            })
            .then(function(media) {
                var responseMedia = null;
                if (media) {
                    responseMedia = media.get({ plain: true });
                }
                if (responseMedia && responseMedia.uuid) {
                    logger.info('Responder [' + self._name + '] responds on mediaByUuid with media [' + media.uuid + '] ' + media.title);
                } else {
                    logger.info('Responder [' + self._name + '] responds on mediaByUuid with no media');
                }
                callback({
                    media: responseMedia,
                    responder: responderUuid
                });
            })
            .catch(function(err) {
                logger.error(err);
                callback({
                    media: null,
                    responder: responderUuid
                });
            });
    }
    mediaByChecksum(request, callback) {
        logger.fatal('Responder [' + this._name + '] cannot respond on mediaByChecksum - method isn\'t implemented yet!');
    }
    allMediaChecksums(request, callback) {

        var responderUuid = this.getResponderUuid();
        var self = this;

        Media
            .findAllChecksums(
                '',
                true,
                function(mediaItems) {
                    logger.info('Responder [' + self._name + '] responds on allMediaChecksums with following list: ', mediaItems);
                    callback({
                        mediaItems: mediaItems,
                        responder: responderUuid
                    });
                },
                function(err) {
                    logger.error(err);
                    callback({
                        media: null,
                        responder: responderUuid
                    });
                }
            )
    }
    getResponderUuid() {
        return this.responder.discovery.me.id;
    }
}

module.exports = MediaResponderProvider;
