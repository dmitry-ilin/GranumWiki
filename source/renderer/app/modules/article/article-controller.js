'use strict';

granumArticle.controller('ArticleController', ['$scope', '$routeParams', '$timeout', 'Article', 'ArticleRecent', 'Media', 'MarkdownMime',
    function($scope, $routeParams, $timeout, Article, ArticleRecent, Media, MarkdownMime) {

        Article.get($routeParams.articleId).then(function(article) {
            $scope.article = article;
            MarkdownMime.setMimeTypes(article.mimeTypes);
            $scope.$apply();
            ArticleRecent.addArticle(article);
        });
    }]);
