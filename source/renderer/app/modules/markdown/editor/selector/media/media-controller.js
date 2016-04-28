'use strict';

granumMarkdown.controller('MarkdownEditorSelectorMediaController', ['$scope', 'Media', 'MediaPreview', '$sce',
    function($scope, Media, MediaPreview, $sce) {
        let fileType = require('file-type'),
            config = require('../config.js');

        $scope.query = '';

        $scope.$parent.mediaSelector.searchMediaItems = $scope.searchMediaItems = function() {
            Media.query($scope.query).then(function(mediaItems) {
                $scope.mediaItems = mediaItems;
                $scope.$apply();

                setTimeout(() => {
                    angular.element('#media-selector').modal('refresh');
                }, 100);
                angular.element('.special.cards .image').dimmer({
                    on: 'hover'
                });
            });
        };

        $scope.insertMedia = function(media) {
            $scope.closeMediaSelector();
            $scope.drawMedia(media);
        };

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
        };

        $scope.getPreview = function(media) {
            return $sce.trustAsHtml(MediaPreview.getImage(media));
        }

    }]);
