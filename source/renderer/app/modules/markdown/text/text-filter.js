'use strict';

granumMarkdown.filter('markdownText', ['markdownItConverter',
    function(markdownItConverter) {
        return function(text) {
            // Need regexp to avoid unnecessary calls to media files
            let html = markdownItConverter.render((text || '').replace(require('../shared/markdown/media-regexp'), ''));
            return angular.element('<div/>').html(html).text();
        };
    }]);
