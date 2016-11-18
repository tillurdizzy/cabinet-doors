angular.module('app').directive('addSpace', addSpace);

function addSpace() {
    var directive =  {
        restrict: 'E',
        scope: {
            margintop: '@',
            marginbottom: '@',
            heightpx: '@'
        },
        templateUrl: 'js/directives/add-space.tpl.html'
    };
    
    return directive;
};
