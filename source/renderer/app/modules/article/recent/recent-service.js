'use strict';

granumArticle.factory('ArticleRecent', [
    function() {
        class ArticleRecent {
            constructor() {
                this._articles = [];
                this._limit = 5;
            }
            getArticles() {
                return this._articles;
            }
            getLimit() {
                return this._limit;
            }
            addArticle(article) {
                for (let i = 0; i < this._articles.length; i++) {
                    if (this._articles[i].uuid == article.uuid) {
                        this._articles.splice(i, 1);
                        break;
                    }
                }
                this._articles.unshift(article);

                if (this._articles.length > this._limit) {
                    this._articles.pop();
                }
            }
        }

        return new ArticleRecent();
    }]);