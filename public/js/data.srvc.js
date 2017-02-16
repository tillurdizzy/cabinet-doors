'use strict';
angular.module('app').service('DB', eventQueries);

eventQueries.$inject = ['$http', '$q'];

function eventQueries($http, $q) {
    var self = this;
    var ME = "DB: ";
    var doTrace = true;
    var httpPathPrefix = "http/";

    var queryPaths = {
        getActiveJobs: httpPathPrefix + "getActiveJobs.php",
        insertDoor: httpPathPrefix + "insertDoor.php",
        deleteDoor: httpPathPrefix + "deleteDoor.php",
        updateDoor: httpPathPrefix + "updateDoor.php",
        getUnitDoors: httpPathPrefix + "getUnitDoors.php"
    };

    var trace = function(obj) {
        if (doTrace) {
            console.log(ME + obj.result);
        }
    };

    self.query = function(query, dataObj) {
        var rtnObj = {};
        var phpPath = queryPaths[query];
        var deferred = $q.defer();
        $http({ method: 'POST', url: phpPath, data: dataObj })
            .success(function(data, status) {
                rtnObj.result = "Success";
                rtnObj.data = data;
                trace(rtnObj);
                deferred.resolve(rtnObj);
            })
            .error(function(data, status, headers, config) {
                rtnObj.result = "Error";
                rtnObj.data = data;
                trace(rtnObj);
                deferred.reject(rtnObj);
            });
        return deferred.promise;
    };

};
