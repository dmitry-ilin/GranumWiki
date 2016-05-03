'use strict';

granumNode.controller('NodeListController', ['$scope', 'Settings', 'Node', 'Notifications',
    function($scope, Settings, Node, Notifications) {
        $scope.nodes = [];

        $scope.refreshNodes = function() {
            $scope.nodes = [];
            Node.getAllNodes().then(function(nodes) {
                let nodeArray = [];
                for (let i in nodes) {
                    nodeArray.push(nodes[i]);
                }
                $scope.nodes = nodeArray;
                $scope.$apply();

                Notifications.showTranslated(
                    'NOTIFICATION.NODE.SCAN_FINISHED',
                    'NOTIFICATION.NODE.DISCOVERED',
                    'primary',
                    { count: $scope.nodes.length }
                );
            });
        };
        $scope.refreshNodes();
    }]);
