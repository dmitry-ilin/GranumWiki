'use strict';

granumElectron.directive('electronMenuUpdate', [
    function() {
        return {
            restrict: 'E',
            terminal: true,
            transclude: false,
            link: function (scope, element, attrs) {
                require('./modules/menu').updateMenu(attrs.route);
            }
        };
    }]);