'use strict';

const ipcMain = require('electron').ipcMain;

const logger = require('../../common/logger');
const ArticleIpc = require('./article-ipc');

var articleIpc = new ArticleIpc();

ipcMain.on('articles-find-query', function(event, data) {

    articleIpc.articlesFind(
        data.searchQuery,
        true,
        function(articles) {
            logger.info('Articles found:');
            for (let i = 0; i < articles.length; i++) {
                logger.info('[' + articles[i].uuid + '] ' + articles[i].title);
            }

            event.sender.send('articles-find-reply', articles);
        },
        function(err) {
            logger.error(err);
            event.sender.send('articles-find-reply-error', err);
        }
    );
});

ipcMain.on('articles-find-by-media-query', function(event, data) {

    articleIpc.articlesFindByMedia(
        data.uuid,
        true,
        function(articles) {
            logger.info('Articles found:');
            for (let i = 0; i < articles.length; i++) {
                logger.info('[' + articles[i].uuid + '] ' + articles[i].title);
            }

            event.sender.send('articles-find-by-media-reply', articles);
        },
        function(err) {
            logger.error(err);
            event.sender.send('articles-find-by-media-reply-error', err);
        }
    );
});

ipcMain.on('article-find-query', function(event, data) {

    articleIpc.articleFind(
        data.uuid,
        function(article) {
            logger.info('Article found: [' + article.uuid + '] ' + article.title);
            let plain = article.get({
                plain: true
            });
            articleIpc.getMimeTypesFromArticleContent(
                article.content,
                function(mimeTypes) {
                    plain.mimeTypes = mimeTypes;
                    event.sender.send('article-find-reply', plain);
                },
                function(err) {
                    logger.error(err);
                    event.sender.send('article-find-reply', plain);
                }
            );
        },
        function(err) {
            logger.error(err);
            event.sender.send('article-find-reply-error', err);
        }
    )
});

ipcMain.on('article-get-mime-types-from-content-query', function(event, data) {

    articleIpc.getMimeTypesFromArticleContent(
        data.content,
        function(mimeTypes) {
            event.sender.send('article-get-mime-types-from-content-reply', mimeTypes);
        },
        function(err) {
            logger.error(err);
            event.sender.send('article-get-mime-types-from-content-reply', {});
        }
    );
});

ipcMain.on('article-save-query', function(event, data) {

    var updateQuery = (data.uuid) ? true : false;

    function success(article) {
        event.sender.send('article-save-reply', article.get({
            plain: true
        }));
    }

    function failure(err) {
        logger.error(err);
        event.sender.send('article-save-reply-error', err);
    }

    if (updateQuery) {
        articleIpc.articleUpdate(data, success, failure);
    } else {
        articleIpc.articleCreate(data, success, failure);
    }
});

ipcMain.on('articles-sync-query', function(event, data) {

    articleIpc.articlesSync(
        function(synced) {
            logger.info('Articles synced:');
            logger.info(synced);
            event.sender.send('articles-sync-reply', {
                synced: synced
            });
        },
        function(err) {
            logger.error(err);
            event.sender.send('articles-sync-reply-error', err);
        }
    )
});

module.exports = articleIpc;
