'use strict';

const app = require('electron').app;
const Sequelize = require('sequelize');

var sequelize = new Sequelize('granum', 'granum', '', {
    host: 'localhost',
    dialect: 'sqlite',

    pool: {
        max: 5,
        min: 0,
        idle: 10000
    },

    storage: app.getPath('userData') + '/granum.sqlite'
});

module.exports = sequelize;
