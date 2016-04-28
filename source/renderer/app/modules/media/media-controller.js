'use strict';

granumMedia.controller('MediaController', ['$scope', '$routeParams', '$timeout', 'Media', 'MediaPreview', '$sce', 'Article',
    function($scope, $routeParams, $timeout, Media, MediaPreview, $sce, Article) {

        Media.get($routeParams.mediaId).then(function(media) {
            $scope.media = media;
            $scope.preview = $sce.trustAsHtml(MediaPreview.get($scope.media));
            $scope.$apply();
            Article.queryByMedia(media).then(function(articles) {
                $scope.articles = articles;
                $scope.$apply();
            });
        });
    }]);
