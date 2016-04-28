'use strict';

granumMarkdown.filter('markdownTextDotsKeep', [
    function() {
        return function(input, limit) {
            if (!input) {
                return;
            }
            if (input.length >= limit) {
                return input.trim() + '...';
            } else {
                return input;
            }
        }
    }]);
