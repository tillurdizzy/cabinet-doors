'use strict';
angular.module('app', ['ngMaterial','ui.router', 'ngUnderscore'])
    .config(initRouter)
    .run(runBlock);

initRouter.$inject = ['$stateProvider', '$urlRouterProvider'];

function initRouter($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise("/home");

    $stateProvider
       

	    .state('home', {
	        url: "/home",
	        templateUrl: "views/home/home.html"
	    })

        .state('home.job', {
            url: "/job",
            templateUrl: "views/home/job.html"
        })

        .state('home.input', {
            url: "/input",
            templateUrl: "views/input/input.html"
        })

        .state('home.unit', {
            url: "/unit",
            templateUrl: "views/home/unit.html"
        })

        .state('home.review', {
            url: "/review",
            templateUrl: "views/home/review.html"
        })

        .state('home.price', {
            url: "/price",
            templateUrl: "views/home/pricing.html"
        })

};

mdTheme.$inject = ['$mdThemingProvider'];

function mdTheme($mdThemingProvider) {
    $mdThemingProvider.theme('default')
        .primaryPalette('blue-grey')
        .accentPalette('red');
};

runBlock.$inject = ['SharedSrvc'];

function runBlock(SharedSrvc) {
    SharedSrvc.initSrvc();
};
