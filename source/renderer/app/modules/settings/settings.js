'use strict';

const granumSettings = angular.module('granumSettings', []);

granumSettings.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.
            when('/settings/view', {
                templateUrl: './app/modules/settings/settings-view.html',
                controller: 'SettingsController'
            })
    }]);
