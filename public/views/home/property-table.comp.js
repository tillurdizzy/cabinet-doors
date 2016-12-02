angular.module('app').component('propertyTable', {
    bindings: {
        name: '=',
        street:'='
    },
    controller: function() {
        
    },
    templateUrl: 'views/home/property-table.tpl.html'
});
