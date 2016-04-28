'use strict';

granumNotifications.factory('Notifications', ['notifyjs', '$translate',
    function(notifyjs, $translate) {
        return {
            show: function(title, body, type) {
                type = type || 'base';
                notifyjs({
                    title: title,
                    body: body
                }, {
                    style: 'semantic-ui-' + type
                });
            },
            showTranslated: function(title, body, type, variables) {
                $translate([title, body], variables).then((translations) => {
                    this.show(
                        translations[title],
                        translations[body],
                        type
                    );
                });
            }
        };
    }]);
