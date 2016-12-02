'use strict';
angular.module('app').factory('SharedSrvc', SharedSrvc);

SharedSrvc.$inject = ['$rootScope', 'DB','$mdDialog'];

function SharedSrvc($rootScope, DB, $mdDialog) {
    var self = this;
    var alertMD;
    var traceMe = true;
    var myID = "SharedSrvc: ";
    self.activeUnit = "";

    self.selectedJob = { PRIMARY_ID: 0, property: "No Property Selected", address: "" };
    var ACTIVE = [];
    var DOORS = [];

    self.initSrvc = function() {

    };

    self.setSelectedJob = function(obj) {
        self.selectedJob = obj;
    };

    self.setUnit = function(str) {
        self.activeUnit = str;
    };

    self.resetJob = function() {
        self.selectedJob = { PRIMARY_ID: 0, property: "No Property Selected", address: "" };
        self.activeUnit = "";
    };

    self.saveDoor = function(doorVO) {
        if (self.selectedJob.PRIMARY_ID == 0) {
            alertMD = $mdDialog.alert({
                title: 'Attention',
                textContent: 'No Property Selected!',
                ok: 'Close'
            });
            $mdDialog
                .show(alertMD)
                .finally(function() {
                    alertMD = undefined;
                });
            return;
        };
        var DBQuery = "insertDoor";
        doorVO.property = self.selectedJob.PRIMARY_ID;
        DB.query(DBQuery, doorVO).then(function(resultObj) {
            if (resultObj.result == "Error" || typeof resultObj.data === "string") {
                alert("Query Error - see console for details");
                console.log("saveDoor ---- " + resultObj.data);
            } else {
                alert(resultObj.result);
            }
        }, function(error) {
            alert("Query Error - SharedCtrl >> saveDoor");
        });
    }

    self.getActiveJobs = function() {
        trace(myID + 'getActiveJobs');
        ACTIVE = [];
        DB.query('getActiveJobs').then(function(resultObj) {
            if (resultObj.result == "Error" || typeof resultObj.data === "string") {
                alert("Query Error - see console for details");
                console.log("getActiveJobs ---- " + resultObj.data);
            } else {
                ACTIVE = resultObj.data;
                $rootScope.$broadcast('onRefreshActiveJobs');
            }
        }, function(error) {
            alert("Query Error - SharedCtrl >> getActiveJobs");
        });
    };

    self.getUnitDoors = function(){
        var dataObj = {};
        dataObj.property = self.selectedJob.PRIMARY_ID;
        dataObj.unit = self.activeUnit;

        DB.query('getUnitDoors',dataObj).then(function(resultObj) {
            if (resultObj.result == "Error" || typeof resultObj.data === "string") {
                alert("Query Error - see console for details");
                console.log("getUnitDoors ---- " + resultObj.data);
            } else {
                DOORS = resultObj.data;
                $rootScope.$broadcast('onRefreshUnitDoors');
            }
        }, function(error) {
            alert("Query Error - SharedCtrl >> getActiveJobs");
        });
    };


    self.returnActiveJobs = function() {
        return ACTIVE;
    };

    self.returnDoors = function() {
        return DOORS;
    };

    self.validateSelectedJob = function() {
        if(self.selectedJob.PRIMARY_ID == 0){
            return false;
        }else{
            return true;
        }
    };

    self.returnSelectedJob = function() {
        return self.selectedJob;
    };


    function trace(msg) {
        if (traceMe == true) {
            console.log(msg);
        }
    };

    self.clone = function(obj) {
        var copy;
        if (null == obj || "object" != typeof obj) return obj;
        if (obj instanceof Date) {
            copy = new Date();
            copy.setTime(obj.getTime());
            return copy;
        }
        if (obj instanceof Array) {
            copy = [];
            for (var i = 0, len = obj.length; i < len; i++) {
                copy[i] = self.clone(obj[i]);
            }
            return copy;
        }
        if (obj instanceof Object) {
            copy = {};
            for (var attr in obj) {
                if (obj.hasOwnProperty(attr)) copy[attr] = self.clone(obj[attr]);
            }
            return copy;
        }
        throw new Error("Unable to copy obj! Its type isn't supported.");
    };

    return self;

};
