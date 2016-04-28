'use strict';

const granumArticle = angular.module('granumArticle', []);

granumArticle.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.
            when('/article/list/:searchQuery', {
                templateUrl: './app/modules/article/list/list-view.html',
                controller: 'ArticleListController'
            }).
            when('/article/list/', {
                templateUrl: './app/modules/article/list/list-view.html',
                controller: 'ArticleListController'
            }).
            when('/article/view/:articleId', {
                templateUrl: './app/modules/article/article-view.html',
                controller: 'ArticleController'
            }).
            when('/article/edit/:articleId', {
                templateUrl: './app/modules/article/edit/edit-view.html',
                controller: 'ArticleEditController'
            }).
            when('/article/new', {
                templateUrl: './app/modules/article/new/new-view.html',
                controller: 'ArticleNewController'
            })
    }]);
