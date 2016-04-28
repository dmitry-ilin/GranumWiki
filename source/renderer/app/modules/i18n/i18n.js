'use strict';

const granumI18n = angular.module('granumI18n', ['pascalprecht.translate']);

granumI18n.config(function ($translateProvider) {

    $translateProvider.translations('en_US', require('./modules/i18n/language/en_US'));
    $translateProvider.translations('ru_RU', require('./modules/i18n/language/ru_RU'));

    let language = require('../main/settings').get('general.language');

    if (language) {
        $translateProvider.preferredLanguage(language);
    } else {
        $translateProvider.preferredLanguage('en_US');
    }
});
