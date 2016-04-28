"use strict";

const Sequelize = require('sequelize');
const sequelize = require('../sequelize');

var MediaChecksum = sequelize.define('media_checksum', {
    id: {
        type: Sequelize.BIGINT,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    media_id: {
        type: Sequelize.BIGINT,
        unique: true,
        allowNull: false
    },
    checksum: {
        type: Sequelize.STRING,
        allowNull: false,
        notEmpty: true
    }
}, {
    freezeTableName: true, // Model tableName will be the same as the model name
    underscored: true,
    paranoid: true
});


module.exports = MediaChecksum;
