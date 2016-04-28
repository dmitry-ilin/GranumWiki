'use strict';

granumElectron.directive('electronLinksExternal', [
    function() {
        const sh = require('shell');

        return {
            restrict: 'A',
            link: function(scope, element) {
                angular.element(element).on('click', 'a', function(event) {
                    let href = angular.element(event.target).attr('href') || '';
                    if (href.match(/^(https?|ftp|mailto)\:/i)) {
                        event.preventDefault();
                        sh.openExternal(href);
                    }
                });
            }
        };
    }]);