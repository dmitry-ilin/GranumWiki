(function(window, angular, markdownit) {
    'use strict';
    function markdownItProvider() {
        var options = {};
        var presetName = 'default';
        var appliedPlugins = [];
        return {
            config: function(preset, opts, plugins) {
                if (angular.isString(preset) && angular.isObject(opts)) {
                    presetName = preset;
                    options = opts;
                } else if (angular.isString(preset)) {
                    presetName = preset;
                } else if (angular.isObject(preset)) {
                    options = preset;
                }
                if (angular.isArray(plugins)) {
                    appliedPlugins = plugins;
                } else if (angular.isObject(preset) && angular.isArray(opts)) {
                    appliedPlugins = opts;
                }
            },
            $get: function() {
                var markdownItInstance = markdownit(presetName, options);
                for (var i = 0; i < appliedPlugins.length; i++) {
                    markdownItInstance.use(appliedPlugins[i].plugin, appliedPlugins[i].options)
                }
                return markdownItInstance;
            }
        };
    }
    function markdownItDirective($sanitize, markdownIt) {
        var attribute = 'markdownIt';
        var render = function(value) {
            return value ? $sanitize(decorate(markdownIt.render(value))) : '';
        };
        var link = function(scope, element, attrs) {
            if (attrs[attribute]) {
                scope.$watch(attribute, function(value) {
                    element.html(render(value));
                });
            } else {
                element.html(render(element.text()));
            }
        };
        return {
            restrict: 'AE',
            priority: 10,
            scope: {
                markdownIt: '='
            },
            replace: true,
            link: link
        };
    }
    function markdownItFilter($sanitize, markdownIt) {
        var render = function(value) {
            return value ? $sanitize(decorate(markdownIt.render(value))) : '';
        };
        return function(text) {
            if (text) {
                text = render(text);
            }
            return text;
        };
    }
    function decorate(element) {
        let container = angular.element('<div/>').html(element);
        container
            .find('table')
            .addClass('ui')
            .addClass('celled')
            .addClass('unstackable')
            .addClass('table');
        return container.html();
    }
    angular.module('mdMarkdownIt', ['ngSanitize'])
        .provider('markdownItConverter', markdownItProvider)
        .directive('markdownIt', ['$sanitize', 'markdownItConverter', markdownItDirective])
        .filter('markdownIt', ['$sanitize', 'markdownItConverter', markdownItFilter]);
})(window, window.angular, window.markdownit);
