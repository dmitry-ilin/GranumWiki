"use strict";

const Sequelize = require('sequelize');
const sequelize = require('../sequelize');

var ArticleChecksum = sequelize.define('article_checksum', {
    id: {
        type: Sequelize.BIGINT,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    article_id: {
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


module.exports = ArticleChecksum;
