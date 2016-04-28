'use strict';

granumMarkdown.filter('markdownLinksHashtag', [
    function () {
        let regex = require('../shared/markdown/hashtag-regexp');
        return function(text, kind) {
            if (text) {
                text = text.replace(regex, '$1<a hashtag-link="true" href=\"#/' + kind + '/list/%23$3\">$2</a>');
            }
            return text;
        };
    }]);
