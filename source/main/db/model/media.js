"use strict";

const Sequelize = require('sequelize');
const sequelize = require('../sequelize');
const FtsMedia = require('./fts-media');
const crypto = require('crypto');
const MediaChecksum = require('./media-checksum');
const mimeType = require('../../../shared/media/mime-type');

const logger = require('../../common/logger');

var Media = sequelize.define('media', {
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
    description: {
        type: Sequelize.TEXT,
        allowNull: false,
        defaultValue: ''
    },
    content: {
        type: Sequelize.BLOB,
        allowNull: true
    },
    mime: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'unknown'
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
    paranoid: false,
    hooks: {
        beforeUpdate: function(media) {
            media.hashtags = Media.findHashtags(media.description).join(' ');
            media.normalizeContent();
            media.mime = Media.getMime(media);

            logger.info(
                'Media.beforeUpdate hook, ' +
                'new version [' + media.version + '], ' +
                'new hashtags [' + media.hashtags + ']'
            );
        },
        beforeCreate: function(media) {
            media.hashtags = Media.findHashtags(media.description).join(' ');
            media.normalizeContent();
            media.mime = Media.getMime(media);

            logger.info(
                'Media.beforeCreate hook, ' +
                'picked hashtags [' + media.hashtags + ']'
            );
        },
        afterCreate: function(media) {
            FtsMedia
                .create({
                    docid: media.id,
                    title: media.title.toLowerCase(),
                    description: media.description.toLowerCase(),
                    hashtags: media.hashtags.toLowerCase()
                });
            MediaChecksum
                .create({
                    media_id: media.id,
                    checksum: media.calculateChecksum()
                });
        },
        afterUpdate: function(media) {
            FtsMedia
                .update({
                    title: media.title.toLowerCase(),
                    description: media.description.toLowerCase(),
                    hashtags: media.hashtags.toLowerCase()
                }, {
                    where: {
                        docid: media.id
                    }
                });
            MediaChecksum
                .upsert({
                    media_id: media.id,
                    checksum: media.calculateChecksum()
                }, {
                    where: {
                        media_id: media.id
                    }
                });
        },
        beforeDelete: function(media) {
            FtsMedia
                .destroy({
                    where: {
                        docid: media.id
                    }
                });
        }
    },
    classMethods: {
        getMime: function(media) {
            return mimeType(media.content);
        },
        findHashtags: function(text) {
            let hashtag,
                hashtags = [],
                regex = require('../../../shared/markdown/hashtag-regexp');

            while (hashtag = regex.exec(text)) {
                hashtags.push(hashtag[2]);
            }

            return hashtags;
        },
        calculateChecksum: function(media) {

            var content = media.content || '';
            var data =
                media.uuid.toString() +
                media.title.toString() +
                media.description.toString() +
                media.version.toString() +
                media.hashtags.toString() +
                content.toString();

            // Should not be in use
            // media.created_at.toString()
            // media.updated_at.toString()

            let checksum = crypto
                .createHash('sha1')
                .update(data, 'utf8')
                .digest('hex');

            logger.info('Calculated checksum for media [' + media.uuid + ']: [' + checksum + ']');

            return checksum;
        },
        findAllChecksums: function(searchQuery, raw, success, failure) {

            var options = {
                raw: raw,
                attributes: ['uuid'],
                include: [
                    {
                        model: MediaChecksum,
                        attributes: ['checksum'],
                        raw: raw
                    }
                ]
            };
            if (searchQuery) {

                FtsMedia.fullTextSearch(searchQuery)
                    .then(function(ftsMediaItems) {
                        var ids = [];
                        for (let i in ftsMediaItems) {
                            ids.push(ftsMediaItems[i].docid);
                        }

                        options.where = {
                            id: {
                                $in: ids
                            }
                        };

                        Media
                            .findAll(options)
                            .then(success)
                            .catch(failure);
                    })
                    .catch(failure);
            } else {
                Media
                    .findAll(options)
                    .then(success)
                    .catch(failure);
            }
        }
    },
    instanceMethods: {
        calculateChecksum: function() {
            return Media.calculateChecksum(this);
        },
        normalizeContent: function() {
            // console.log(new Uint16Array(this.content.data.slice()));
            if (this.content && this.content.type == 'Buffer') {
                this.content = new Buffer(new Uint16Array(this.content.data));
            }
        }
    }
});


module.exports = Media;
