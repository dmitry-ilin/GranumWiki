'use strict';

granumSearchbar.controller('SearchbarController', ['$scope',
    function($scope) {
        let remote = require('electron').remote;
        let webContents = remote.getCurrentWebContents();

        webContents.on('found-in-page', foundInPage);

        window.addEventListener('beforeunload', function(e) {
            webContents.removeListener('found-in-page', foundInPage);
        });

        function foundInPage(event, result) {
            if (result.matches) {
                angular.element('#page-search-results').text(result.matches - 1);
            } else {
                angular.element('#page-search-results').text(0);
            }
        }

        function focusSearchInput() {
            setTimeout(function() {
                angular.element('#page-search-input').focus();
            }, 10);
        }

        function search(text, forward, next) {
            if (text) {
                webContents.findInPage(text, {
                    forward: forward,
                    findNext: next
                });
            } else {
                stopSearch();
                angular.element('#page-search-results').text(0);
            }
            focusSearchInput();
        }

        function stopSearch() {
            webContents.stopFindInPage('keepSelection');
        }

        $scope.startSearch = function(text) {
            search(text, true, false);
        };

        $scope.searchNext = function(text) {
            search(text, true, true);
        };

        $scope.searchPrev = function(text) {
            search(text, false, true);
        };

        $scope.stopSearch = function() {
            stopSearch();
        };

        angular.element(document).click(function(event) {
            let container = angular.element('#searchbar:visible');

            if (container.length && !container.is(event.target)
                && container.has(event.target).length === 0)
            {
                angular.element('#page-search-input').blur();
                container.animate({opacity: 0, bottom: '-100px'}, 500, function() {
                    container.hide();
                });
                stopSearch();
            }
        });
    }]);