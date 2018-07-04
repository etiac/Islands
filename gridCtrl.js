app.controller('gridCtrl', function($scope, gridDataSrv) {

    $scope.appMode = "start";
    $scope.numberOfIsland = 0;
    $scope.disableSolved = false;
//    $scope.bitMapStr = "";
    
    $scope.drawBitMap = function(){
        $scope.grid = gridDataSrv.initBitMap($scope.mD, $scope.nD);
    };
    
    $scope.randomizeMap = function(){
        $scope.drawBitMap();
        $scope.grid = gridDataSrv.initIslands();
        $scope.appMode = "solve";
    };
    
    $scope.solveIslands = function() {
        $scope.numberOfIsland = gridDataSrv.findIslands();
        $scope.disableSolved = true;
    };
    
    $scope.bonusLevel = function(){
        $scope.appMode = "bonus";
        $scope.drawBitMap();
    };
    
    $scope.flipCell = function(row, col){
        if ($scope.disableSolved){
            return;
        }
        $scope.grid = gridDataSrv.flipBit(row, col);
    };
    
    $scope.solveBonus = function(){
      gridDataSrv.updateNeighbor();
      $scope.numberOfIsland = gridDataSrv.findIslands();
      $scope.disableSolved = true;
    };
    
    
    $scope.backFromBonus = function(){
      $scope.numberOfIsland = 0;
      $scope.mD = '';
      $scope.nD = '';
      $scope.disableSolved = false;
      $scope.appMode = "start";
    };
    
        
//    $scope.printBitMap = function(){
//      $scope.bitMapStr = "";
//      for (var row = 0; row<$scope.mD; row++){
//          for (var col =0; col < $scope.nD; col++){
//              $scope.bitMapStr += $scope.grid[row][col].color + " ";
//          }
//          $scope.bitMapStr += "\n";
//      }  
//    };
});