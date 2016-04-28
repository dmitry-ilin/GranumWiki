'use strict';

const settings = require('../../../settings');
const Requester = require('cote').Requester;

const logger = require('../../../common/logger');

class ArticleRequesterProvider {
    constructor() {
        this._name = 'articleRequester';
        this._namespace = 'granumWikiArticle';
        this._requests = ['articleByUuid', 'articleByChecksum', 'allArticleChecksums'];
        this._token = settings.get('node.token');

        this._queue = [];
        this._isReady = false;

        settings.on('save', this._settingsUpdated.bind(this));
        this._init();
    }
    _init() {
        this.requester = new Requester({
            name: this._name,
            namespace: this._namespace + '[' + this._token + ']',
            requests: this._requests
        }, {
            reuseAddr: true,
            ignoreProcess: true,
            ignoreInstance: true
        });

        this.requester.on('ready', () => {
            this._onReady();
        });
    }
    reinit() {
        this._isReady = false;
        if (this.requester) {
            try {
                if (this.requester.sock) {
                    this.requester.sock.close();
                }
                this.requester.close();
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
    _request(event, data, callback) {
        let request = {
            type: event,
            data: data,
            callback: callback
        };

        if (this._isReady) {
            this._sendRequestToAll(request);
        } else {
            this._queue.push(request)
        }
    }
    _sendRequestToAll(request) {
        var responses = {},
            sendRequest = this._sendRequest.bind(this);

        var sendNextRequest = function() {
            sendRequest({
                type: request.type,
                data: request.data,
                callback: function(response) {
                    if (!responses[response.responder]) {
                        responses[response.responder] = response;
                        sendNextRequest();
                    } else {
                        request.callback(responses);
                    }
                }
            });
        };
        sendNextRequest();
    }
    _onReady() {
        logger.info('Requester [' + this._name + '] is ready');
        this._isReady = true;
        while (this._queue.lenght > 0) {
            this._sendRequest(this._queue.shift());
        }
    }
    _sendRequest(request) {
        this.requester.send({
            type: request.type,
            data: request.data
        }, request.callback);
    }
    articleByUuid(uuid, callback) {
        logger.info('Requester [' + this._name + '] requests articleByUuid [' + uuid + ']');
        this._request('articleByUuid', { uuid: uuid }, callback);
    }
    articleByChecksum(checksum, callback) {
        logger.info('Requester [' + this._name + '] requests articleByChecksum [' + checksum + ']');
        this._request('articleByChecksum', { checksum: checksum }, callback);
    }
    allArticleChecksums(callback) {
        logger.info('Requester [' + this._name + '] requests allArticleChecksums');
        this._request('allArticleChecksums', {}, callback);
    }
}

module.exports = ArticleRequesterProvider;
