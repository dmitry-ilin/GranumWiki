'use strict';

granumMedia.controller('MediaListController', ['$scope', '$routeParams', 'Media', 'MediaPreview', '$sce',
    function($scope, $routeParams, Media, MediaPreview, $sce) {
        let fileType = require('file-type'),
            config = require('../config.js');

        $scope.query = decodeURIComponent($routeParams.searchQuery || "");

        $scope.isLoading = true;
        $scope.mediaNotFound = false;
        $scope.isEmptyQuery = !$scope.query;

        $scope.searchMediaItems = function() {
            $scope.isLoading = true;
            $scope.isEmptyQuery = !$scope.query;
            Media.query($scope.query).then(function(mediaItems) {
                $scope.isLoading = false;
                $scope.mediaNotFound = !(mediaItems && mediaItems.length > 0);
                $scope.mediaItems = mediaItems;
                $scope.$apply();

                angular.element('.special.cards .image').dimmer({
                    on: 'hover'
                });
            });
        }

        $scope.getCategory = function(media) {
            let mimeType = fileType(media.content);
            let category = mimeType ? config.media.allowedMimeTypes[mimeType.mime] : '';

            let result = '';

            switch (category) {
                case 'image':
                    result = 'NGVIEW.MEDIA.LIST.CATEGORY.IMAGE';
                    break;
                case 'audio':
                    result = 'NGVIEW.MEDIA.LIST.CATEGORY.AUDIO';
                    break;
            }
            return result;
        }

        $scope.getPreview = function(media) {
            return $sce.trustAsHtml(MediaPreview.getImage(media));
        }

        $scope.searchMediaItems();
    }]);
