angular.module('app').controller('HomeCtrl', myFunction);

myFunction.$inject = ['$scope', 'SharedSrvc', '$state', 'ListSrvc', '$mdDialog'];

function myFunction($scope, SharedSrvc, $state, ListSrvc, $mdDialog) {
    var vm = this;
    vm.S = SharedSrvc;
    var traceMe = true;
    var alert;
    var ME = "HomeCtrl: ";
    vm.L = ListSrvc;
    vm.FORM = { unit: "#", room: "", width: "0", height: "0", hinges: "", pull: "" };
    vm.unitInput = "0";

    vm.navLocation = "Home";
    vm.ACTIVE_JOBS = [];
    vm.UNIT_DOORS = [];
    vm.JobID = 0;
    vm.showKeyboard = false;
    vm.editActiveH = false;
    vm.editActiveW = false;
    vm.editActiveUnit = false;

    vm.MATERIALS = [{item:"item 1",qty:15},{item:"item 2",qty:15}];

    vm.goNav = function(st) {
    	trace('goNav');
        switch (st) {
            case "home":break;
            case "home.job":break;
            case "home.unit":
                vm.editActiveUnit = true;
                break;
            case "home.review":
                getUnitDoors();
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
    	trace('saveDoor');
    	var v = validateForm();
        if (v) {
        	var dataObj = vm.S.clone(vm.FORM);
            vm.S.saveDoor(dataObj);
            vm.UNIT_DOORS.push(dataObj);
            vm.FORM.width = "0";
            vm.FORM.height = "0";
            vm.FORM.hinges = "";
            vm.FORM.pull = "";

            vm.editActiveW = false
    		vm.editActiveH = false;
    		vm.showKeyboard = false;
        }
    };

    function getUnitDoors(){
    	vm.S.getUnitDoors();
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

    vm.editH = function(){
    	trace('editH');
    	if(vm.editActiveH == true){
    		vm.editActiveH = false;
    		vm.showKeyboard = false;
    	}else{
    		vm.editActiveH = true
    		vm.editActiveW = false;
    		vm.showKeyboard = true;
    	}
    };

    vm.editW = function(){
    	trace('editW');
    	if(vm.editActiveW == true){
    		vm.editActiveW = false;
    		vm.showKeyboard = false;
    	}else{
    		vm.editActiveW = true
    		vm.editActiveH = false;
    		vm.showKeyboard = true;
    	}
    };

    vm.numpad = function(k){
    	var key = k;
    	var input = "";
    	// Determine working item
    	if(vm.editActiveW){
    		input = vm.FORM.width;
    	}else if(vm.editActiveH){
    		input = vm.FORM.height;
    	}else if(vm.editActiveUnit){
    		input = vm.unitInput;
    	}
    	// Parse key
    	if(input == "0"){
    		input = "";
    	}

    	if(key == "-"){
    		var n = input.length;
    		input = input.slice(0,n-1);
    	}else{
    		input+=key;
    	}
    	// Assign key to item
    	if(vm.editActiveW){
    		vm.FORM.width = input;
    	}else if(vm.editActiveH){
    		vm.FORM.height = input;
    	}else if(vm.editActiveUnit){
    		vm.unitInput = input;
    	}
    };

    // Used for Property selection
    vm.editRowItem = function(row) {
        vm.JobID = row.id;
        vm.S.setSelectedJob(row);
        $state.transitionTo('home');
       
    };

     // Used for Property selection
    vm.editDoor = function(row) {
       vm.FORM = row;
       $state.transitionTo('home.input');
    };

    vm.selectUnit = function() {
        vm.FORM.unit = vm.unitInput;
        vm.S.setUnit(vm.FORM.unit);
        vm.editActiveUnit = false;
        $state.transitionTo('home');
        vm.unitInput = "0";
    };


    function resetJob() {
        vm.S.resetJob();
        resetInput();
        $state.transitionTo('home');
       
    };

    function resetInput() {
        vm.FORM = { unit: "#", room: "", width: "0", height: "0", hinges: "", pull: "" };
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

    $scope.$on('onRefreshUnitDoors', function() {
        trace('onRefreshUnitDoors');
        vm.UNIT_DOORS = vm.S.returnDoors();
    });


};
