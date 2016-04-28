'use strict';

granumArticle.controller('ArticleListController', ['$scope', '$routeParams', 'Article',
    function($scope, $routeParams, Article) {
        $scope.query = decodeURIComponent($routeParams.searchQuery || "");

        $scope.isLoading = true;
        $scope.articlesNotFound = false;
        $scope.isEmptyQuery = !$scope.query;

        $scope.searchArticles = function() {
            $scope.isLoading = true;
            $scope.isEmptyQuery = !$scope.query;
            Article.query($scope.query).then(function(articles) {
                $scope.isLoading = false;
                $scope.articlesNotFound = !(articles && articles.length > 0);
                $scope.articles = articles;
                $scope.$apply();
            });
        };
        $scope.searchArticles();
    }]);
