'use strict';

const os = require('os');
const randomstring = require("randomstring");

module.exports = {
    general: {
        language: "en_US"
    },
    synchronization: {
        startup: "1",
        frequency: "360"
    },
    node: {
        name: os.hostname(),
        token: randomstring.generate({
            length: 64,
            charset: 'alphanumeric',
            capitalization: 'uppercase'
        })
    }
}
