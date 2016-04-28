'use strict';

const settings = require('../../../settings');
const Requester = require('cote').Requester;

const logger = require('../../../common/logger');

class NodeRequesterProvider {
    constructor() {
        this._name = 'nodeRequester';
        this._namespace = 'granumWikiNode';
        this._requests = ['getNodeName'];
        this._token = settings.get('node.token');

        this._queue = [];
        this._isReady = false;
        this._timeout = 3000;

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

        var completed = false;

        var timeout = setTimeout(function() {
            if (!completed) {
                completed = true;
                request.callback(responses);
            }
        }, this._timeout);

        var sendNextRequest = function() {
            sendRequest({
                type: request.type,
                data: request.data,
                callback: function(response) {
                    if (!completed) {
                        if (!responses[response.responder]) {
                            responses[response.responder] = response;
                            sendNextRequest();
                        } else {
                            completed = true;
                            request.callback(responses);
                        }
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
    getNodeNames(callback) {
        logger.info('Requester [' + this._name + '] requests getNodeNames');
        this._request('getNodeName', {}, callback);
    }
}

module.exports = NodeRequesterProvider;
