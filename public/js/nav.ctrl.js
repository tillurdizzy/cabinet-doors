'use strict';
angular.module('app').controller('NavCtrl',myFunction);

myFunction.$inject = ['$scope','$state','$location','SharedSrvc'];

function myFunction($scope,$state,$location,SharedSrvc) { 
	
	var me = this;
	var S = SharedSrvc;

	
	me.goNav = function(st){
		$state.transitionTo(st);
	};

	me.isCurrentPath = function (path) {
        var x = $location.path();
        var xSplit = x.split('/')
        var y = xSplit[1];  
        return y == path;
    };

 };