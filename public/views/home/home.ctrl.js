angular.module('app').controller('HomeCtrl', myFunction);

myFunction.$inject = ['$scope', 'SharedSrvc', '$state', 'ListSrvc', '$mdDialog'];

function myFunction($scope, SharedSrvc, $state, ListSrvc, $mdDialog) {
    var vm = this;
    vm.S = SharedSrvc;
    var traceMe = true;
    var alert;
    var ME = "HomeCtrl: ";
    vm.L = ListSrvc;
    vm.FORM = { unit: "#", room: "", width: "", height: "", hinges: "", pull: "" };
    vm.unitInput = "";

    vm.navLocation = "Home";
    vm.ACTIVE_JOBS = [];
    vm.UNIT_DOORS = [];
    vm.JobID = 0;


    vm.goNav = function(st) {
        switch (st) {
            case "home":
                vm.navLocation = "Home";
                break;
            case "home.job":
                vm.navLocation = "Select Property";
                break;
            case "home.unit":
                vm.navLocation = "Select Unit";
                break;
            case "home.review":
                vm.navLocation = "Unit Review";
                break;
            case "home.input":
                var jobStatus = vm.S.validateSelectedJob();
                if (!jobStatus) {
                	popAlert('No Property Selected!');
                    return;
                };

                var u = vm.FORM.unit;
                if (u == "#") {
                	popAlert('No Unit Selected!');
                    return;
                };

                // If no alerts, then...
                vm.navLocation = "Input Form";
                break;
        }
        $state.transitionTo(st);
    };

    vm.saveDoor = function() {
    	var v = validateForm();
        if (v) {
            vm.S.saveDoor(vm.FORM);
            vm.UNIT_DOORS.push(vm.FORM);
            vm.FORM.width = "";
            vm.FORM.height = "";
            vm.FORM.hinges = "";
            vm.FORM.pull = "";
        }
    };

    function validateForm() {
    	
        if (vm.FORM.width == "") {
            popAlert('Please enter width.');
        }else if(vm.FORM.height == ""){
        	popAlert('Please enter height.');
        }else if(vm.FORM.room == ""){
        	popAlert('Please enter room.');
        }else if(vm.FORM.hinges == ""){
        	popAlert('Please enter hinges.');
        }else if(vm.FORM.pull == ""){
        	popAlert('Please enter pull.');
        }else{
        	return true;
        };
        return false;
    };

    function popAlert(message) {
        alert = $mdDialog.alert({
            title: 'Attention',
            textContent: message,
            ok: 'Close'
        });
        $mdDialog.show(alert).finally(function() {
            alert = undefined;
        });
    };

    // Used for Property selection
    vm.editRowItem = function(row) {
        vm.JobID = row.id;
        vm.S.setSelectedJob(row);
        $state.transitionTo('home');
        vm.navLocation = "Home";
    };

    vm.selectUnit = function() {
        vm.FORM.unit = vm.unitInput;
        $state.transitionTo('home');
        vm.navLocation = "Home";
        vm.unitInput = "";
    };


    function resetJob() {
        vm.S.resetJob();
        resetInput();
        $state.transitionTo('home');
        vm.navLocation = "Home";
    };

    function resetInput() {
        vm.FORM = { unit: "#", room: "", width: "", height: "", hinges: "", pull: "" };
        vm.UNIT_DOORS = [];
    };


    function trace(msg) {
        if (traceMe == true) {
            console.log(ME + msg);
        }
    };

    // $scope Events
    $scope.$watch('$viewContentLoaded', function() {
        trace('viewContentLoaded');
        vm.S.getActiveJobs();
    });

    $scope.$on('onRefreshActiveJobs', function() {
        trace('onRefreshActiveJobs');
        vm.ACTIVE_JOBS = vm.S.returnActiveJobs();
    });




};
