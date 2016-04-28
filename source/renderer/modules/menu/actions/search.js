'use strict';

module.exports = {
    globalSearch: function() {
        let $offCanvas = angular.element('#off-canvas');
        function showSearch() {
            angular.element('#global-search-input').focus();
        }
        if ($offCanvas && $offCanvas.sidebar('is visible')) {
            $offCanvas.sidebar('hide', showSearch);
        } else {
            showSearch();
        }
    },
    pageSearch: function() {
        let $offCanvas = angular.element('#off-canvas');
        function showSearch() {
            angular.element('#searchbar:hidden').show().animate({opacity: 1, bottom: '0px'}, 500);
            angular.element('#page-search-input').focus();
        }
        if ($offCanvas && $offCanvas.sidebar('is visible')) {
            $offCanvas.sidebar('hide', showSearch);
        } else {
            showSearch();
        }
    }
};
