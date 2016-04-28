'use strict';

granumMedia.controller('MediaEditController', ['$scope', '$routeParams', '$location', 'Media', 'Notifications',
    function($scope, $routeParams, $location, Media, Notifications) {

        // Will be populated by form controller
        $scope.media = {};

        if (!$routeParams.mediaId) {
            $location.url('/media/new');
        }
    }]);
