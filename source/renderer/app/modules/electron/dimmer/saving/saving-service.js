'use strict';

granumElectron.factory('ElectronDimmerSaving', [
    function() {
        let options = {
            duration: {
                show: 50,
                hide: 50
            },
            opacity: 0.7
        };
        angular.element('#saving-dimmer').dimmer(options);

        return {
            show: function() {
                angular.element('#saving-dimmer').dimmer('show');
            },
            hide: function() {
                angular.element('#saving-dimmer').dimmer('hide');
            }
        };
    }]);