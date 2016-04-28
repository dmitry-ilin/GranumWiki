'use strict';

granumMarkdown.directive('markdownLinksAnchor', ['$location', '$anchorScroll',
    function($location, $anchorScroll) {
        return {
            restrict: 'A',
            link: function(scope, element) {
                angular.element(element).on('click', 'a', function(event) {
                    let $target = angular.element(event.target);
                    let href = ($target.attr('href') || '').trim();
                    if (href.length > 0 && href[0] == '#') {
                        if (!$target.attr('hashtag-link') && !$target.attr('internal-link')) {
                            event.preventDefault();
                            $anchorScroll(href.slice(1).toLowerCase());
                        }
                    }
                });
            }
        };
    }]);
