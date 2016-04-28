'use strict';

granumMedia.factory('MediaPreview', ['Media',
    function(Media) {
        let mimeType = require('../shared/media/mime-type'),
            config = require('../config.js');

        return {
            get: function(media, useContent) {
                useContent = useContent || false;

                if (media && media.content) {
                    let mime = mimeType(media.content);
                    let category = config.media.allowedMimeTypes[mime];

                    let src = '';
                    if (useContent) {
                        src = 'data:' + mime + ';base64,' + media.content.toString('base64');
                    } else {
                        src = 'media://' + media.uuid;
                    }

                    if (category == 'image') {
                        return '<img class="ui fluid bordered image" src="' + src + '">';
                    } else if (category == 'audio') {
                        return '<audio controls src="' + src + '">';
                    }
                }

                return '';
            },
            getImage: function(media) {
                if (media && media.content) {
                    let mime = mimeType(media.content);
                    let category = config.media.allowedMimeTypes[mime];

                    if (category == 'image') {
                        return '<img class="ui fluid image" src="media://' + media.uuid + '">';
                    } else if (category == 'audio') {
                        return '<img class="ui fluid image" src="./image/default/audio.png">';
                    }
                }

                return '<img class="ui fluid image" src="./image/default/unknown.png">';
            },
            render: function(parent) {
                let self = this;
                // Need to process media items sequentially
                let mediaItems = angular.element(parent).find('[media-uuid]').toArray();
                function processNextItem() {
                    if (!mediaItems.length) {
                        return;
                    }

                    let mediaItem = mediaItems.shift();
                    Media.get(angular.element(mediaItem).attr('media-uuid')).then(function(media) {
                        angular.element(mediaItem).html(self.get(media));
                        setTimeout(processNextItem, 10);
                    });
                }
                processNextItem();
            }
        };
    }]);
