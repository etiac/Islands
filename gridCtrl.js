app.controller('gridCtrl', function($scope, gridDataSrv, $timeout) {

    $scope.appMode = "start";
    $scope.numberOfIsland = 0;
    $scope.disableSolved = false;
    $scope.disableStartButtons = true;
    $scope.showError = false;
    $scope.loading = false;
    
    $scope.drawBitMap = function(){
        $scope.grid = gridDataSrv.initBitMap($scope.mD, $scope.nD);
    };
    
    //check the n and m input
    $scope.onChangedInput = function(){
        if ($scope.mD <= 0 || $scope.nD <= 0){
            $scope.showError = true;
            $scope.disableStartButtons = true;
        }else{
            $scope.showError = false;
            if ($scope.nD >0 && $scope.mD > 0){
                $scope.disableStartButtons = false;
            }
        }
    }
    
    //create random map with black islands on it
    $scope.randomizeMap = function(){
        $scope.loading = true;
        $timeout(function () { // to be able to show a loading gif while waiting for the map to be build
            $scope.grid = gridDataSrv.initIslands($scope.mD, $scope.nD);
            $scope.$emit("loaded");
        },50);
        
        $scope.$on("loaded", function () {
            $scope.loading = false; 
            $scope.appMode = "solve"; })
    };
    
    //solve islands for the random map
    $scope.solveIslands = function() {
        $scope.loading = true;
        $timeout(function () {
            $scope.numberOfIsland = gridDataSrv.findIslands();
            $scope.$emit("loadedSolve");
        },50);
        
        $scope.$on("loadedSolve", function () {
        $scope.loading = false;
        $scope.disableSolved = true;})
    };
    
    //draw the map for the bonus view
    $scope.bonusLevel = function(){
        $scope.appMode = "bonus";
        $scope.loading = true;
        $timeout(function () {
            $scope.drawBitMap();
            $scope.$emit("loadedBonus");
        },50);
        
        $scope.$on("loadedBonus", function () {
        $scope.loading = false;  })
            
    };
    
    //caused by a click on a bit in the bonus map - change the color 
    $scope.flipCell = function(row, col){
        if ($scope.disableSolved){
            return;
        }
        $scope.grid = gridDataSrv.flipBit(row, col);
    };
    
    
    //find the islands for the bonus map
    $scope.solveBonus = function(){
        $scope.loading = true;
        $timeout(function () {
            gridDataSrv.updateNeighbor();
            $scope.numberOfIsland = gridDataSrv.findIslands();
            $scope.$emit("loadedSolveBonus");
        },50);
        
        $scope.$on("loadedSolveBonus", function () {
        $scope.loading = false;
        $scope.disableSolved = true; })
    };
    
    //back button 
    $scope.backFromBonus = function(){
        $scope.numberOfIsland = 0;
        $scope.mD = '';
        $scope.nD = '';
        $scope.disableSolved = false;
        $scope.disableStartButtons = true;
        $scope.loading = false;
        $scope.appMode = "start";
    };
    
});