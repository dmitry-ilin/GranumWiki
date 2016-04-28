"use strict";

const Sequelize = require('sequelize');
const sequelize = require('../sequelize');

var FtsMedia = sequelize.define('fts_media', {
    docid: {
        type: Sequelize.BIGINT,
        allowNull: false,
        primaryKey: true
    },
    title: {
        type: Sequelize.STRING,
        allowNull: false,
        notEmpty: true
    },
    description: {
        type: Sequelize.TEXT,
        allowNull: false,
        defaultValue: ''
    },
    hashtags: {
        type: Sequelize.STRING(4096),
        allowNull: false,
        defaultValue: ''
    }
}, {
    freezeTableName: true, // Model tableName will be the same as the model name
    underscored: true,
    timestamps: false,
    paranoid: false,
    classMethods: {
        fullTextSearch: function(text) {
            return sequelize
                .query(
                    'SELECT docid FROM fts_media WHERE fts_media MATCH $text',
                    {
                        bind: { text: text.toLowerCase() },
                        type: sequelize.QueryTypes.SELECT
                    }
                );
        }
    }
});


module.exports = FtsMedia;
