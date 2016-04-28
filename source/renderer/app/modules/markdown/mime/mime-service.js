'use strict';

granumMarkdown.factory('MarkdownMime', [
    function() {
        let preloadedTypes = {};

        return {
            getMimeType: function(url) {
                return preloadedTypes[url];
            },
            setMimeType: function(url, type) {
                preloadedTypes[url] = type;
            },
            setMimeTypes: function(types) {
                preloadedTypes = types || {};
            }
        };
    }]);