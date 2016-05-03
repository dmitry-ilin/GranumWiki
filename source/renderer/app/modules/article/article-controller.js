'use strict';

granumArticle.controller('ArticleController', ['$scope', '$routeParams', '$timeout', '$translate', 'Article', 'ArticleRecent', 'Media', 'MarkdownMime',
    function($scope, $routeParams, $timeout, $translate, Article, ArticleRecent, Media, MarkdownMime) {

        Article.get($routeParams.articleId).then(function(article) {
            $scope.article = article;
            MarkdownMime.setMimeTypes(article.mimeTypes);
            $scope.$apply();
            ArticleRecent.addArticle(article);
        }).catch(function(err) {
            if (err['not_found']) {
                $translate('NGVIEW.ARTICLE.VIEW.NOT_FOUND').then((translation) => {
                    $scope.article = {
                        title: translation,
                        content: ''
                    };
                });
            }
        });
    }]);
