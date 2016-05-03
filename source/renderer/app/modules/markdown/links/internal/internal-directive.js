'use strict';

granumMarkdown.directive('markdownLinksInternal', ['$window',
    function($window) {
        let internalPrefix = 'granum://';

        return {
            restrict: 'A',
            link: function(scope, element) {
                angular.element(element).on('click', 'a', function(event) {
                    let $target = angular.element(event.target);
                    let href = ($target.attr('href') || '').trim();
                    if (href.length > internalPrefix.length && href.slice(0, internalPrefix.length) == internalPrefix) {
                        if (!$target.attr('hashtag-link')) {
                            event.preventDefault();
                            $window.location.hash = '#/article/view/' + href.slice(internalPrefix.length);
                        }
                    }
                });
            }
        };
    }]);