'use strict';

module.exports = {
    getService: function(service) {
        return module.exports._getElement().injector().get(service);
    },
    getScope: function() {
        return module.exports._getElement().scope();
    },
    _getElement: function() {
        return angular.element($('[ng-view]'));
    }
};
