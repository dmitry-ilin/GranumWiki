'use strict';

const settings = require('../../../settings');
const Responder = require('cote').Responder;
const Article = require('../../../db/model/article');
const ArticleChecksum = require('../../../db/model/article-checksum');

const logger = require('../../../common/logger');

class ArticleResponderProvider {
    constructor() {
        this._name = 'articleResponder';
        this._namespace = 'granumWikiArticle';
        this._respondsTo = ['articleByUuid', 'articleByChecksum', 'allArticleChecksums'];
        this._token = settings.get('node.token');

        this._isReady = false;
        settings.on('save', this._settingsUpdated.bind(this));
        this._init();
    }
    _init() {
        this.responder = new Responder({
            name: this._name,
            namespace: this._namespace + '[' + this._token + ']',
            respondsTo: this._respondsTo
        }, {
            reuseAddr: true,
            ignoreProcess: true,
            ignoreInstance: true
        });

        this.responder.on('ready', () => {
            this._onReady();
        });

        this.responder.on('articleByUuid', this.articleByUuid.bind(this));
        this.responder.on('articleByChecksum', this.articleByChecksum.bind(this));
        this.responder.on('allArticleChecksums', this.allArticleChecksums.bind(this));
    }
    reinit() {
        this._isReady = false;
        if (this.responder) {
            try {
                if (this.responder.sock) {
                    this.responder.sock.close();
                }
                this.responder.close();
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
        logger.info('Responder [' + this._name + '] is ready');
        this._isReady = true;
    }
    articleByUuid(request, callback) {
        var self = this;
        var uuid = request.data.uuid;

        var responderUuid = this.getResponderUuid();

        Article
            .find({
                where: {
                    uuid: uuid
                }
            })
            .then(function(article) {
                var responseArticle = null;
                if (article) {
                    responseArticle = article.get({ plain: true });
                }
                if (responseArticle && responseArticle.uuid) {
                    logger.info('Responder [' + self._name + '] responds on articleByUuid with article [' + article.uuid + '] ' + article.title);
                } else {
                    logger.info('Responder [' + self._name + '] responds on articleByUuid with no article');
                }
                callback({
                    article: responseArticle,
                    responder: responderUuid
                });
            })
            .catch(function(err) {
                logger.error(err);
                callback({
                    article: null,
                    responder: responderUuid
                });
            });
    }
    articleByChecksum(request, callback) {
        logger.fatal('Responder [' + this._name + '] cannot respond on articleByChecksum - method isn\'t implemented yet!');
    }
    allArticleChecksums(request, callback) {

        var responderUuid = this.getResponderUuid();
        var self = this;

        Article
            .findAllChecksums(
                '',
                true,
                function(articles) {
                    logger.info('Responder [' + self._name + '] responds on allArticleChecksums with following list: ', articles);
                    callback({
                        articles: articles,
                        responder: responderUuid
                    });
                },
                function(err) {
                    logger.error(err);
                    callback({
                        article: null,
                        responder: responderUuid
                    });
                }
            )
    }
    getResponderUuid() {
        return this.responder.discovery.me.id;
    }
}

module.exports = ArticleResponderProvider;
