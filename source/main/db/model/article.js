"use strict";

const Sequelize = require('sequelize');
const sequelize = require('../sequelize');
const FtsArticle = require('./fts-article');
const crypto = require('crypto');
const ArticleChecksum = require('./article-checksum');

const logger = require('../../common/logger');

var Article = sequelize.define('article', {
    id: {
        type: Sequelize.BIGINT,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    uuid: {
        type: Sequelize.UUID,
        unique: true,
        allowNull: false,
        defaultValue: Sequelize.UUIDV4
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
    version: {
        type: Sequelize.INTEGER,
        allowNull: false,
        min: 0,
        defaultValue: 1
    },
    hashtags: {
        type: Sequelize.STRING(4096),
        allowNull: false,
        defaultValue: ''
    }
    // Created At and Updated At added automatically
}, {
    freezeTableName: true, // Model tableName will be the same as the model name
    underscored: true,
    paranoid: true,
    hooks: {
        beforeUpdate: function(article) {
            article.hashtags = Article.findHashtags(article.content).join(' ');

            logger.info(
                'Article.beforeUpdate hook, ' +
                'new version [' + article.version + '], ' +
                'new hashtags [' + article.hashtags + ']'
            );
        },
        beforeCreate: function(article) {
            article.hashtags = Article.findHashtags(article.content).join(' ');

            logger.info(
                'Article.beforeCreate hook, ' +
                'picked hashtags [' + article.hashtags + ']'
            );
        },
        afterCreate: function(article) {
            FtsArticle
                .create({
                    docid: article.id,
                    title: article.title.toLowerCase(),
                    content: article.content.toLowerCase(),
                    hashtags: article.hashtags.toLowerCase()
                });
            ArticleChecksum
                .create({
                    article_id: article.id,
                    checksum: article.calculateChecksum()
                });
        },
        afterUpdate: function(article) {
            FtsArticle
                .update({
                    title: article.title.toLowerCase(),
                    content: article.content.toLowerCase(),
                    hashtags: article.hashtags.toLowerCase()
                }, {
                    where: {
                        docid: article.id
                    }
                });
            ArticleChecksum
                .upsert({
                    article_id: article.id,
                    checksum: article.calculateChecksum()
                }, {
                    where: {
                        article_id: article.id
                    }
                });
        },
        beforeDelete: function(article) {
            FtsArticle
                .destroy({
                    where: {
                        docid: article.id
                    }
                });
        }
    },
    classMethods: {
        findHashtags: function(text) {
            let hashtag,
                hashtags = [],
                regex = require('../../../shared/markdown/hashtag-regexp');

            while (hashtag = regex.exec(text)) {
                hashtags.push(hashtag[2]);
            }

            return hashtags;
        },
        calculateChecksum: function(article) {
            var data =
                article.uuid.toString() +
                article.title.toString() +
                article.content.toString() +
                article.version.toString() +
                article.hashtags.toString();

            // Should not be in use
            // article.created_at.toString()
            // article.updated_at.toString()

            let checksum = crypto
                .createHash('sha1')
                .update(data, 'utf8')
                .digest('hex');

            logger.info('Calculated checksum for article [' + article.uuid + ']: [' + checksum + ']');

            return checksum;
        },
        findAllChecksums: function(searchQuery, raw, success, failure) {

            var options = {
                raw: raw,
                attributes: ['uuid'],
                include: [
                    {
                        model: ArticleChecksum,
                        attributes: ['checksum'],
                        raw: raw
                    }
                ]
            };
            if (searchQuery) {

                FtsArticle.fullTextSearch(searchQuery)
                    .then(function(ftsArticles) {
                        var ids = [];
                        for (let i in ftsArticles) {
                            ids.push(ftsArticles[i].docid);
                        }

                        options.where = {
                            id: {
                                $in: ids
                            }
                        };

                        Article
                            .findAll(options)
                            .then(success)
                            .catch(failure);
                    })
                    .catch(failure);
            } else {
                Article
                    .findAll(options)
                    .then(success)
                    .catch(failure);
            }
        }
    },
    instanceMethods: {
        calculateChecksum: function() {
            return Article.calculateChecksum(this);
        }
    }
});


module.exports = Article;
