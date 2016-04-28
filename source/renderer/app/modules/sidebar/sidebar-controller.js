'use strict';

granumSidebar.controller('SidebarController', ['$scope', 'ArticleRecent',
    function($scope, ArticleRecent) {
        $scope.closeSidebar = function() {
            angular.element('#off-canvas').sidebar('hide');
        };

        $scope.$on("$locationChangeStart", function(event) {
            $scope.closeSidebar();
        });

        $scope.recentArticles = ArticleRecent.getArticles();
    }]);
