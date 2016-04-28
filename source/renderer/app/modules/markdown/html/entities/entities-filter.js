'use strict';

granumMarkdown.filter('markdownHtmlEntities', [
    function () {
        return function(text, kind) {
            if (text) {
                text = angular.element('<div/>').text(text).html();
            }
            return text;
        };
    }]);
