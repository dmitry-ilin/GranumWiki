'use strict';

const Article = require('../../db/model/article');
const ArticleChecksum = require('../../db/model/article-checksum');
const FtsArticle = require('../../db/model/fts-article');
const Media = require('../../db/model/media');

const publisherProvider = require('../../exchange/publisher/article-modifications');
const requesterProvider = require('../../exchange/requester/article');
const responderProvider = require('../../exchange/responder/article');

const logger = require('../../common/logger');

class ArticleIpc {
    constructor() {

    }

    articlesFind (searchQuery, raw, success, failure) {
        var options = {
            raw: raw,
            order: [
                ['updated_at', 'DESC']
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
            options.limit = 20;
            Article
                .findAll(options)
                .then(success)
                .catch(failure);
        }
    }

    articlesFindByMedia (uuid, raw, success, failure) {
        if (uuid) {
            var options = {
                raw: raw,
                where: {
                    content: {
                        $like: '%media://' + uuid + '%'
                    }
                },
                order: [
                    ['updated_at', 'DESC']
                ]
            };

            Article
                .findAll(options)
                .then(success)
                .catch(failure);
        } else {
            if (failure) {
                failure({error: 'No UUID to search for'});
            }
        }
    }

    articleFind (uuid, success, failure) {
        if (uuid) {
            var options = {
                where: { uuid: uuid }
            };

            Article
                .find(options)
                .then(success)
                .catch(failure);

        } else {
            if (failure) {
                failure({error: 'No UUID to search for'});
            }
        }
    }

    getMimeTypesFromArticleContent (articleContent, success, failure) {
        let regExp = require('../../../shared/markdown/media-regexp'),
            match,
            uuids = {};

        while (match = regExp.exec(articleContent)) {
            uuids[match[2]] = match[0];
        }

        if (Object.keys(uuids).length > 0) {
            Media.findAll({
                attributes: ['mime', 'uuid'],
                where: {
                    uuid: {
                        $in: Object.keys(uuids)
                    }
                }
            }).then(function(mediaItems) {
                let result = {};
                for (let i = 0; i < mediaItems.length; i++) {
                    result[uuids[mediaItems[i].uuid]] = mediaItems[i].mime;
                }
                success(result);
            }).catch(failure);
        } else {
            success({});
        }
    }

    articleCreate (data, success, failure) {
        if (data) {
            Article
                .create(data)
                .then(function(article) {
                    logger.info('Article created: [' + article.uuid + '] ' + article.title);
                    publisherProvider.articleCreated(article);

                    return article;
                })
                .then(success)
                .catch(failure);
        } else {
            if (failure) {
                failure({error: 'No data provided'});
            }
        }
    }

    articleUpdate (data, success, failure) {
        if (data) {
            this.articleFind(
                data.uuid,
                function(article) {
                    data.version = article.version + 1; // Bump version
                    article
                        .update(data)
                        .then(function(article) {
                            logger.info('Article updated: [' + article.uuid + '] ' + article.title);
                            publisherProvider.articleUpdated(article);

                            return article;
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

    articlesSync(success, failure) {
        function getDiff(localChecksums, checksums) {
            var diff = [];

            if (localChecksums) {
                let localChecksumsObject = {};
                for (let i = 0; i < localChecksums.length; i++) {
                    localChecksumsObject[localChecksums[i]['uuid']] = localChecksums[i]['article_checksum.checksum'];
                }

                for (let i in checksums) {
                    for (let j = 0; j < checksums[i].articles.length; j++) {
                        let uuid = checksums[i].articles[j]['uuid'];
                        let checksum = checksums[i].articles[j]['article_checksum.checksum'];
                        let localChecksum = localChecksumsObject[uuid];

                        if (!localChecksum || localChecksum != checksum) {
                            if (diff.indexOf(uuid) < 0) {
                                logger.info(
                                    'Article [' + uuid + '] may require update: ' +
                                    'local checksum is [' + localChecksum + ']' +
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

                function syncArticle(uuid) {
                    logger.trace('Start syncing article [' + uuid + ']');
                    requesterProvider.articleByUuid(uuid, function(responses) {
                        logger.trace('Found all available versions for article [' + uuid + ']');
                        var latestVersion = null;

                        for (var i in responses) {
                            let article = responses[i].article;
                            if (!latestVersion && article) {
                                latestVersion = article;
                            } else if (latestVersion && article) {
                                if ((new Date(article.updated_at)).getTime() > (new Date(latestVersion.updated_at)).getTime()) {
                                    latestVersion = article;
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

                            Article.findOne(options).then(function(article) {
                                if (article) {
                                    ArticleChecksum.findOne({
                                        where: {
                                            article_id: article.id
                                        }
                                    }).then(function(articleChecksum) {
                                        if (!articleChecksum || Article.calculateChecksum(latestVersion) != articleChecksum.checksum) {
                                            logger.info('Article [' + latestVersion.uuid + '] does require update and it is being updated');
                                            article
                                                .update(latestVersion, options)
                                                .then(syncNextArticle);
                                        } else {
                                            logger.info('Article [' + latestVersion.uuid + '] does not require update');
                                        }
                                    });
                                } else {
                                    Article
                                        .create(latestVersion, options)
                                        .then(syncNextArticle);
                                }
                            });
                        } else {
                            syncNextArticle();
                        }

                    });
                }

                function syncNextArticle() {
                    if (diff.length) {
                        syncArticle(diff.shift());
                    } else {
                        resolve(synced);
                    }
                }
                syncNextArticle();
            });
        }

        requesterProvider.allArticleChecksums(function(response) {
            try {
                Article
                    .findAllChecksums(
                    '',
                    true,
                    function(articles) {
                        var diff = getDiff(articles, response);
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

module.exports = ArticleIpc;
