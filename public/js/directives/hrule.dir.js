angular.module('app').directive('horizRule', horizontalRule);

function horizontalRule() {
    return {
        restrict: 'E',
        scope: {
            margintop: '@',
            marginbottom: '@'
        },
        templateUrl: 'js/directives/hrule.tpl.html'
    }
};
