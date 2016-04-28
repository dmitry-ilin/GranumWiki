'use strict';

const granumNode = angular.module('granumNode', []);

granumNode.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.
            when('/node/list', {
                templateUrl: './app/modules/node/list/list-view.html',
                controller: 'NodeListController'
            })
    }]);
