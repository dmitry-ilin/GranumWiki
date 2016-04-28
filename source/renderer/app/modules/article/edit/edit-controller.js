'use strict';

granumArticle.controller('ArticleEditController', ['$scope', '$routeParams', '$location',
    function($scope, $routeParams, $location) {

        // Will be populated by form controller
        $scope.article = {};

        if (!$routeParams.articleId) {
            $location.url('/article/new');
        }
    }]);
