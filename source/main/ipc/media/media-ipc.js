'use strict';

const Media = require('../../db/model/media');
const MediaChecksum = require('../../db/model/media-checksum');
const FtsMedia = require('../../db/model/fts-media');

const publisherProvider = require('../../exchange/publisher/media-modifications');
const requesterProvider = require('../../exchange/requester/media');
const responderProvider = require('../../exchange/responder/media');

const logger = require('../../common/logger');

class MediaIpc {
    constructor() {

    }

    mediaItemsFind (searchQuery, raw, success, failure) {
        var options = {
            raw: raw,
            order: [
                ['updated_at', 'DESC']
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
            options.limit = 20;
            Media
                .findAll(options)
                .then(success)
                .catch(failure);
        }
    }

    mediaFind (uuid, success, failure) {
        if (uuid) {
            var options = {
                where: { uuid: uuid }
            };

            Media
                .find(options)
                .then(success)
                .catch(failure);

        } else {
            if (failure) {
                failure({error: 'No UUID to search for'});
            }
        }
    }

    mediaCreate (data, success, failure) {
        if (data) {
            Media
                .create(data)
                .then(function(media) {
                    logger.info('Media created: [' + media.uuid + '] ' + media.title);
                    publisherProvider.mediaCreated(media);

                    return media;
                })
                .then(success)
                .catch(failure);
        } else {
            if (failure) {
                failure({error: 'No data provided'});
            }
        }
    }

    mediaUpdate (data, success, failure) {
        if (data) {
            this.mediaFind(
                data.uuid,
                function(media) {
                    data.version = media.version + 1; // Bump version
                    media
                        .update(data)
                        .then(function(media) {
                            logger.info('Media updated: [' + media.uuid + '] ' + media.title);
                            publisherProvider.mediaUpdated(media);

                            return media;
                        })
                        .then(success)
                        .catch(failure);
                },
                failure
            );
        } else {
            if (failure) {
                failure({error: 'No data provided'});
            }
        }
    }

    mediaItemsSync(success, failure) {
        function getDiff(localChecksums, checksums) {
            var diff = [];

            if (localChecksums) {
                let localChecksumsObject = {};
                for (let i = 0; i < localChecksums.length; i++) {
                    localChecksumsObject[localChecksums[i]['uuid']] = localChecksums[i]['media_checksum.checksum'];
                }

                for (let i in checksums) {
                    for (let j = 0; j < checksums[i].mediaItems.length; j++) {
                        let uuid = checksums[i].mediaItems[j]['uuid'];
                        let checksum = checksums[i].mediaItems[j]['media_checksum.checksum'];
                        let localChecksum = localChecksumsObject[uuid];

                        if (!localChecksum || localChecksum != checksum) {
                            if (diff.indexOf(uuid) < 0) {
                                logger.info(
                                    'Media [' + uuid + '] may require update: ' +
                                    'local checksum is [' + localChecksum + '] ' +
                                    'remote checksum is [' + checksum + ']'
                                );
                                diff.push(uuid);
                            }
                        }
                    }
                }
            } else {
                throw new Error('Error fetching local checksums');
            }

            return diff;
        }

        function syncDiff(diff) {

            return new Promise(function(resolve, reject) {
                diff = diff || [];

                var synced = [];

                function syncMedia(uuid) {
                    logger.trace('Start syncing media [' + uuid + ']');
                    requesterProvider.mediaByUuid(uuid, function(responses) {
                        logger.trace('Found all available versions for media [' + uuid + ']');
                        var latestVersion = null;

                        for (var i in responses) {
                            let media = responses[i].media;
                            if (!latestVersion && media) {
                                latestVersion = media;
                            } else if (latestVersion && media) {
                                if ((new Date(media.updated_at)).getTime() > (new Date(latestVersion.updated_at)).getTime()) {
                                    latestVersion = media;
                                }
                            }
                        }

                        if (latestVersion) {
                            delete latestVersion.id;
                            synced.push(latestVersion.uuid);

                            let options = {
                                where: {
                                    uuid: latestVersion.uuid
                                }
                            };

                            Media.findOne(options).then(function(media) {
                                if (media) {
                                    MediaChecksum.findOne({
                                        where: {
                                            media_id: media.id
                                        }
                                    }).then(function(mediaChecksum) {
                                        if (!mediaChecksum || Media.calculateChecksum(latestVersion) != mediaChecksum.checksum) {
                                            logger.info('Media [' + latestVersion.uuid + '] does require update and it is being updated');
                                            media
                                                .update(latestVersion, options)
                                                .then(syncNextMedia);
                                        } else {
                                            logger.info('Media [' + latestVersion.uuid + '] does not require update');
                                        }
                                    });
                                } else {
                                    Media
                                        .create(latestVersion, options)
                                        .then(syncNextMedia);
                                }
                            });
                        } else {
                            syncNextMedia();
                        }

                    });
                }

                function syncNextMedia() {
                    if (diff.length) {
                        syncMedia(diff.shift());
                    } else {
                        resolve(synced);
                    }
                }
                syncNextMedia();
            });
        }

        requesterProvider.allMediaChecksums(function(response) {
            try {
                Media.findAllChecksums(
                    '',
                    true,
                    function(mediaItems) {
                        console.log(mediaItems);
                        var diff = getDiff(mediaItems, response);
                        logger.info('Synchronization diff: ', diff);

                        syncDiff(diff)
                            .then(success)
                            .catch(failure);
                    },
                    function(err) {
                        logger.error(err);
                        if (failure) {
                            failure(err);
                        }
                    }
                );
            } catch (err) {
                if (failure) {
                    failure(err);
                }
            }
        });
    }
}

module.exports = MediaIpc;
