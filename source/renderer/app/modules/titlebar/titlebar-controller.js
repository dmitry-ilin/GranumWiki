'use strict';

granumTitlebar.controller('TitlebarController', ['$scope', '$routeParams', '$location',
    function($scope, $routeParams, $location) {

        $scope.openSidebar = function() {
            angular.element('#off-canvas').sidebar('show');
        };

        $scope.searchArticles = function() {
            if ($scope.$parent.$parent.query) {
                $location.url('/article/list/' + encodeURIComponent($scope.$parent.$parent.query));
            } else {
                $location.url('/article/list');
            }
        }
    }]);
