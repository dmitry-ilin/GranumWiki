'use strict';

const fileType = require('file-type');

module.exports = function(fileContent, defaultType) {
    defaultType = defaultType || 'unknown';
    let type = fileType(fileContent);
    return type ? type.mime : defaultType;
};
