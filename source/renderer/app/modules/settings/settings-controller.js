'use strict';

granumSettings.controller('SettingsController', ['$scope', '$translate', 'Settings', 'Notifications',
    function($scope, $translate, Settings, Notifications) {
        Settings.get('.').then(function(settings) {
            $scope.settings = settings;
            $scope.$apply();

            let $form = angular.element('#settings-form');

            $translate('FORM.ERROR.REQUIRED').then((translation) => {
                $form
                    .form({
                        fields: {
                            'settings.node.name': {
                                rules: [
                                    {
                                        type: 'empty',
                                        prompt: translation
                                    }
                                ]
                            },
                            'settings.node.token': {
                                rules: [
                                    {
                                        type: 'empty',
                                        prompt: translation
                                    }
                                ]
                            }
                        },
                        inline: true
                    });
            });

            $scope.saveSettings = function() {
                if ($form.form('validate form')) {
                    Settings.set('.', $scope.settings).then(function() {
                        Settings.get('general.language').then(function(language) {
                            $translate.use(language);
                            $scope.$apply();

                            Notifications.showTranslated(
                                'NOTIFICATION.SETTINGS.SAVE_SUCCESS',
                                null,
                                'success'
                            );
                        }).catch(function() {
                            Notifications.showTranslated(
                                'NOTIFICATION.SETTINGS.APPLY_LANGUAGE_FAILURE',
                                'NOTIFICATION.SETTINGS.SAVE_FAILURE_TEXT',
                                'alert'
                            );
                        });
                    }).catch(function() {
                        Notifications.showTranslated(
                            'NOTIFICATION.SETTINGS.SAVE_FAILURE',
                            'NOTIFICATION.SETTINGS.SAVE_FAILURE_TEXT',
                            'alert'
                        );
                    });
                } else {
                    Notifications.showTranslated(
                        'NOTIFICATION.SETTINGS.VALIDATION_ERRORS',
                        'NOTIFICATION.SETTINGS.FIX_ERRORS',
                        'warning'
                    );
                }
            }
        });
    }]);
