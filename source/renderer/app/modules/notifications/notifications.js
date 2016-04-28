'use strict';

const granumNotifications = angular.module('granumNotifications', []);

granumNotifications.config(['notifyjsProvider',
    function(notifyjsProvider) {
        let styles = [
            'base',
            'primary',
            'secondary',
            'success',
            'warning',
            'alert'
        ];

        notifyjsProvider.defaults = {
            clickToHide: true,
            autoHide: true,
            autoHideDelay: 3000,
            arrowShow: true,
            arrowSize: 5,
            elementPosition: 'bottom left',
            globalPosition: 'bottom right',
            style: 'primary-base',
            className: '',
            showAnimation: 'fadeIn',
            showDuration: 300,
            hideAnimation: 'fadeOut',
            hideDuration: 300,
            gap: 2
        };

        let notifyjs = notifyjsProvider.$get();
        for (let style of styles) {
            notifyjs.addStyle('semantic-ui-' + style, {
                html:
                    '<div>' +
                        '<div class="ui ' + style + ' message">' +
                            '<div class="header" data-notify-text="title"/>' +
                            '<p data-notify-text="body"/>' +
                        '</div>' +
                    '</div>',
                classes: {
                    base: {
                        'padding-right': '1rem',
                        'font-size': '0.9rem'
                    }
                }
            });
        }
    }]);
