'use strict';

const settings = require('../../settings');
const requesterProvider = require('../../exchange/requester/node');
const responderProvider = require('../../exchange/responder/node');

class NodeIpc {
    constructor() {

    }

    getAllNodes () {
        return new Promise(function(resolve, reject) {
            requesterProvider.getNodeNames(function(nodes) {
                // Add Current node to list
                nodes[responderProvider.getResponderUuid()] = {
                    name: settings.get('node.name'),
                    responder: responderProvider.getResponderUuid(),
                    isCurrent: true
                };

                resolve(nodes);
            });
        });
    }
}

module.exports = NodeIpc;
