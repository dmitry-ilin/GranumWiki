'use strict';

const granumMedia = angular.module('granumMedia', []);

granumMedia.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.
            when('/media/list/:searchQuery', {
                templateUrl: './app/modules/media/list/list-view.html',
                controller: 'MediaListController'
            }).
            when('/media/list/', {
                templateUrl: './app/modules/media/list/list-view.html',
                controller: 'MediaListController'
            }).
            when('/media/view/:mediaId', {
                templateUrl: './app/modules/media/media-view.html',
                controller: 'MediaController'
            }).
            when('/media/edit/:mediaId', {
                templateUrl: './app/modules/media/edit/edit-view.html',
                controller: 'MediaEditController'
            }).
            when('/media/new', {
                templateUrl: './app/modules/media/new/new-view.html',
                controller: 'MediaNewController'
            })
    }]);
