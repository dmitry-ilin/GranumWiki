'use strict';

const settings = require('../../../settings');
const Subscriber = require('cote').Subscriber;
const Article = require('../../../db/model/article');

const logger = require('../../../common/logger');

class ArticleSubscriberProvider {
    constructor() {
        this._name = 'articleModificationsSubscriber';
        this._namespace = 'granumWikiArticleModifications';
        this._subscribesTo = ['articleCreated', 'articleUpdated'];
        this._token = settings.get('node.token');

        settings.on('save', this._settingsUpdated.bind(this));
        this._init();
    }
    _init() {
        this.subscriber = new Subscriber({
            name: this._name,
            namespace: this._namespace + '[' + this._token + ']',
            subscribesTo: this._subscribesTo
        }, {
            reuseAddr: true,
            ignoreProcess: true,
            ignoreInstance: true
        });

        this.subscriber.on('ready', () => {
            this._onReady();
        });

        this.subscriber.on('articleCreated', this.articleCreated);
        this.subscriber.on('articleUpdated', this.articleUpdated);
    }
    reinit() {
        this._isReady = false;
        if (this.subscriber) {
            try {
                if (this.subscriber.sock) {
                    this.subscriber.sock.close();
                }
                this.subscriber.close();
            } catch (e) {
                logger.warn(e);
            }
        }
        this._init();
    }
    _settingsUpdated() {
        var newToken = settings.get('node.token');
        if (newToken != this._token) {
            this._token = settings.get('node.token');
            this.reinit();
        }
    }
    _onReady() {
        logger.info('Subscriber [' + this._name + '] is ready');
        this._isReady = true;
    }
    articleCreated(article) {
        Article
            .find({
                where: { uuid: article.uuid }
            })
            .then(function(localArticle) {
                if (!localArticle) {
                    Article
                        .create(article)
                        .then((article) => {
                            logger.info('Article created via network: ', article);
                        })
                        .catch((err) => { logger.error(err) });
                } else {
                    logger.error('Duplicated article UUID [' + article.uuid + ']');
                }
            })
            .catch((err) => { logger.error(err) });
    }
    articleUpdated(article) {
        Article
            .find({
                where: { uuid: article.uuid }
            })
            .then(function(localArticle) {
                if (!localArticle) {
                    Article
                        .create(article)
                        .then((article) => {
                            logger.info('Article updated (created) via network: ', article);
                        })
                        .catch((err) => { logger.error(err) });
                } else {
                    let localArticleCreatedAt = (new Date(localArticle.created_at)).getTime(),
                        articleCreatedAt = (new Date(article.created_at)).getTime(),
                        localArticleUpdatedAt = (new Date(localArticle.updated_at)).getTime(),
                        articleUpdatedAt = (new Date(article.updated_at)).getTime();

                    if (
                        localArticleCreatedAt == articleCreatedAt &&
                        localArticleUpdatedAt < articleUpdatedAt &&
                        localArticle.version < article.version
                    ) {
                        localArticle
                            .update(article)
                            .then((article) => {
                                logger.info('Article updated via network: ', article);
                            })
                            .catch((err) => { logger.error(err) })
                    } else {
                        logger.error('Cannot update article: ' + article.uuid);
                    }
                }
            })
            .catch((err) => { logger.error(err) });
    }
}

module.exports = ArticleSubscriberProvider;
