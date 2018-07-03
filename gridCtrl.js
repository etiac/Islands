app.controller('gridCtrl', function($scope, gridDataSrv) {
    $scope.isForm = "form1";
    $scope.appMode = "start";
    $scope.bitMapStr = "";
    
    $scope.drawBitMap = function(){
        $scope.appMode = "draw";
        $scope.isForm = "form2";
        $scope.grid = gridDataSrv.initBitMap($scope.nD, $scope.mD);
        $scope.appMode = "iniidated";
    };
    
    $scope.printBitMap = function(){
      $scope.bitMapStr = "";
      for (var row = 0; row<$scope.mD; row++){
          for (var col =0; col < $scope.nD; col++){
              $scope.bitMapStr += $scope.grid[row][col].color + " ";
          }
          $scope.bitMapStr += "\n";
      }  
    };
    
    $scope.randomizeMap = function(){
        $scope.grid = gridDataSrv.initIslands();
    };
    
    $scope.solveIslands = function() {
        $scope.appMode = "solve";
    };
    
    $scope.bonusLevel = function(){
        $scopeMode = "bonus";
    };
    
});