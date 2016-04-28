'use strict';

/* App Module */
const granumApp = angular.module('GranumWiki', [
    'ngRoute',

    'ngSanitize',
    'mdMarkdownIt',
    'ngEnter',
    'notifyjs',

    'granumElectron',
    'granumI18n',
    'granumSidebar',
    'granumTitlebar',
    'granumSearchbar',
    'granumNotifications',
    'granumNode',
    'granumSettings',
    'granumMarkdown',
    'granumArticle',
    'granumMedia'
]);

granumApp.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.
            otherwise({
              redirectTo: '/article/list'
            });
    }]);

granumApp.config(['$compileProvider',
    function($compileProvider) {
        $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|tel|file|granum):/);
        $compileProvider.imgSrcSanitizationWhitelist(/^\s*((https?|ftp|file|blob|media):|data:image\/)/);
    }
]);
