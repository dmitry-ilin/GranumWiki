'use strict';

granumMedia.controller('MediaEditFormController', ['$scope', '$routeParams', '$location', 'Media', 'Notifications', '$translate', 'MediaPreview', '$sce',
    function($scope, $routeParams, $location, Media, Notifications, $translate, MediaPreview, $sce) {

        let fs = require('fs'),
            dialog = require('electron').remote.dialog,
            fileType = require('file-type'),
            config = require('../config.js');

        let $form = angular.element('#media-form');
        $translate('FORM.ERROR.REQUIRED').then((translation) => {
            $form
                .form({
                    fields: {
                        'media.title': {
                            rules: [
                                {
                                    type: 'empty',
                                    prompt: translation
                                }
                            ]
                        }
                    },
                    inline: true
                });
        });

        $scope.updateContentPreview = function() {
            $scope.preview = $sce.trustAsHtml(MediaPreview.get($scope.media, true));
            $scope.$apply();
        };

        if ($routeParams.mediaId) {
            Media.get($routeParams.mediaId).then(function(media) {
                $scope.media = media;
                $scope.$parent.media.uuid = $scope.media.uuid;
                $scope.$parent.media.title = $scope.media.title;
                $scope.updateContentPreview();
                $scope.$apply();
            });
        } else {
            $scope.media = {};
        }

        $scope.cancelMedia = function() {
            if ($scope.media.uuid) {
                $location.url('/media/view/' + $scope.media.uuid);
            } else {
                $location.url('/media/list/');
            }
        };

        $scope.selectMedia = function() {
            dialog.showOpenDialog({
                properties: ['openFile'],
                filters: [
                    { name: 'Images', extensions: ['jpg', 'png', 'gif'] },
                    { name: 'Audio', extensions: ['mp3', 'ogg'] },
                    { name: 'All Supported Files', extensions: ['jpg', 'png', 'gif', 'mp3', 'ogg'] }
                ]
            }, function(filenames) {
                if (filenames && filenames.length) {
                    fs.readFile(filenames[0], function(err, data) {

                        if (!err) {
                            let mimeType = $scope.getMime(data);
                            if (Object.keys(config.media.allowedMimeTypes).indexOf(mimeType) >= 0) {
                                $scope.media.content = data;
                            } else {
                                // ERROR
                                $scope.media.content = null;
                            }
                            $scope.updateContentPreview();
                        } else {
                            // ERROR
                        }
                    });
                }
            });
        };

        $scope.getMime = function(data) {
            let mimeType = fileType(data);
            return mimeType ? mimeType.mime : mime;
        };

        $scope.saveMedia = function() {
            if ($form.form('validate form')) {
                Media.save($scope.media).then(function(media) {
                    $location.url('/media/view/' + media.uuid);
                    $scope.$apply();
                    Notifications.showTranslated(
                        'NOTIFICATION.MEDIA.SAVE_SUCCESS',
                        null,
                        'success'
                    );
                }).catch(function() {
                    Notifications.showTranslated(
                        'NOTIFICATION.MEDIA.SAVE_FAILURE',
                        'NOTIFICATION.MEDIA.SAVE_FAILURE_TEXT',
                        'alert'
                    );
                });
            } else {
                Notifications.showTranslated(
                    'NOTIFICATION.MEDIA.VALIDATION_ERRORS',
                    'NOTIFICATION.MEDIA.FIX_ERRORS',
                    'warning'
                );
            }
        };
    }]);
