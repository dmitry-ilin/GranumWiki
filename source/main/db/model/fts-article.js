"use strict";

const Sequelize = require('sequelize');
const sequelize = require('../sequelize');

var FtsArticle = sequelize.define('fts_article', {
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
    content: {
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
                    'SELECT docid FROM fts_article WHERE fts_article MATCH $text',
                    {
                        bind: { text: text.toLowerCase() },
                        type: sequelize.QueryTypes.SELECT
                    }
                );
        }
    }
});


module.exports = FtsArticle;
