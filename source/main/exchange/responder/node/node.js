'use strict';

const settings = require('../../../settings');
const Responder = require('cote').Responder;

const logger = require('../../../common/logger');

class NodeResponderProvider {
    constructor() {
        this._name = 'nodeResponder';
        this._namespace = 'granumWikiNode';
        this._respondsTo = ['getNodeName'];
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

        this.responder.on('getNodeName', this.getNodeName.bind(this));
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
        this._isReady = true;
    }
    getNodeName(request, callback) {
        let nodeName = settings.get('node.name');
        logger.info('Responder [' + this._name + '] responds on getNodeName with name [' + nodeName + ']');
        callback({
            name: nodeName,
            responder: this.getResponderUuid()
        });
    }
    getResponderUuid() {
        return this.responder.discovery.me.id;
    }
}

module.exports = NodeResponderProvider;
