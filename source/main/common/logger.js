'use strict';

const mkdirp = require('mkdirp');
const app = require('electron').app;
const log4js = require('log4js');

let path = app.getPath('userData') + '/logs';

mkdirp.sync(path);

log4js.configure({
  appenders: [
    {
        type: 'console'
    },
    {
        type: 'file',
        filename: path + '/common.log',
        category: 'common',
        maxLogSize: 10 * 1024 * 1024, // 10Mb
        backups: 10
    }
  ],
  replaceConsole: true
});

module.exports = log4js.getLogger('common');
