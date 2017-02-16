'use strict';
angular.module('app').factory('SharedSrvc', SharedSrvc);

SharedSrvc.$inject = ['$rootScope', 'DB','$mdDialog', 'underscore'];

function SharedSrvc($rootScope, DB, $mdDialog, underscore) {
    var self = this;
    var alertMD;
    var traceMe = true;
    var myID = "SharedSrvc: ";
    self.activeUnit = "";

    self.selectedJob = { PRIMARY_ID: 0, property: "No Property Selected", address: "" };
    var ACTIVE = [];
    var DOORS = [];
    self.unitTotals = {doors:0,sqft:0,pulls:0,hinges:0,total:0};



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
                //alert(resultObj.result);
            }
        }, function(error) {
            alert("Query Error - SharedCtrl >> saveDoor");
        });
    }

    self.updateDoor = function(doorVO){
        var DBQuery = "updateDoor";
        doorVO.property = self.selectedJob.PRIMARY_ID;
        DB.query(DBQuery, doorVO).then(function(resultObj) {
            if (resultObj.result == "Error" || typeof resultObj.data === "string") {
                alert("Query Error - see console for details");
                console.log("updateDoor ---- " + resultObj.data);
            } else {
                alert(resultObj.result);
            }
        }, function(error) {
            alert("Query Error - SharedCtrl >> updateDoor");
        });
    };

    self.deleteDoor = function(doorVO){
        var DBQuery = "deleteDoor";
        doorVO.property = self.selectedJob.PRIMARY_ID;
        DB.query(DBQuery, doorVO).then(function(resultObj) {
            if (resultObj.result == "Error") {
                alert("Query Error - see console for details");
                console.log("deleteDoor ---- " + resultObj.data);
            } else {
                $rootScope.$broadcast('deleteSuccessful');
            }
        }, function(error) {
            alert("Query Error - SharedCtrl >> deleteDoor");
        });
    };

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
                var preSorted = resultObj.data;
                processDoors(preSorted);
                //DOORS = underscore.sortBy((underscore.sortBy(preSorted, 'width')), 'height');
            }
        }, function(error) {
            alert("Query Error - SharedCtrl >> getActiveJobs");
        });
    };

    function processDoors(list){
        self.unitTotals = {doors:0,sqft:0,pulls:0,hinges:0,total:0};
        DOORS = underscore.sortBy((underscore.sortBy(list, 'width')), 'height');
        self.unitTotals.doors = DOORS.length;
        for (var i = 0; i < DOORS.length; i++) {
            var H = Number(DOORS[i].height);
            var W = Number(DOORS[i].width);
            var sqIn = H*W;
            var sqFt = decimalPrecisionTwo(sqIn / 144);
            if(sqFt < 1){
                sqFt = 1;
            };
            self.unitTotals.sqft += sqFt;
            DOORS[i].sqFt = decimalPrecisionTwo(sqFt);
            //DOORS[i].price = decimalPrecisionTwo(sqFt * 11);
            //self.unitTotals.total += DOORS[i].price;
            if(H < 6){
                DOORS[i].hinges = 0;
            }else{
                DOORS[i].hinges = 2;
                self.unitTotals.hinges+=2;
            }
            DOORS[i].pull = 1;
            self.unitTotals.pulls+=1;
        }
        var temp = decimalPrecisionTwo(self.unitTotals.sqft);
        self.unitTotals.sqft = temp;
        self.unitTotals.total = decimalPrecisionTwo(temp*11);
        
        $rootScope.$broadcast('onRefreshUnitDoors');
    };

    function decimalPrecisionTwo(data) {
        var num = Number(data);
        var result = Math.round(num * 100) / 100
        return result;
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
