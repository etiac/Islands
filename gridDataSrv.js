var app = angular.module('myApp', []);
    app.service('gridDataSrv', function () { 
    
    this.nD = 0;
    this.mD = 0;

        
    //creat a bit object for a selected bit value
    function Bit(i,j, bitVal, color) {
        var bit = {bit : bitVal, htmlColor: color, row : i, col : j, coloredConnectedNeighbors : [] };
        return bit;
    }
    
    //init bit map without color and bit value for the bonus mode
    this.initBitMap = function (m,n) {
        this.nD = n;
        this.mD = m;
        this.grid = new Array(this.mD); 
        for (var row = 0; row < this.mD; row++){
            this.grid[row] = new Array(this.nD);
            
        }
        return this.grid;  
    }
    

    //init the bit map for the random mode - in order to reduce run time - while creating the map select the color for each cell
    this.initIslands = function(m,n){
        this.nD = n;
        this.mD = m;
        
        this.grid = new Array(this.mD); 
        for (var row =0; row < this.mD; row++){
            this.grid[row] = new Array(this.nD); 

            var numOfRandom = Math.floor((Math.random()*this.nD)/6 + 2);
            
            for (var i = 0; i < numOfRandom; i++){
                
                var col = Math.floor(Math.random()*this.nD);
                
                if (this.grid[row][col] == undefined){
                    this.grid[row][col] = Bit(row, col, 1, 'black');
                    this.updateNeighborForOneCell(row, col);  // need to be adjusted
                }
            }
        }
        
        return this.grid;
    }
    
    //uodate only the cells that already exists - if color is black then update both lists 
    // current cell and its neighbor
    //help to reduce the number of operations for each cell
    this.updateNeighborForOneCell = function(row,col){
        this.updateNeighborsArrayForOneCell(row, col, row-1, col-1);
        this.updateNeighborsArrayForOneCell(row, col, row-1, col);
        this.updateNeighborsArrayForOneCell(row, col, row-1, col+1);

        this.updateNeighborsArrayForOneCell(row, col, row, col-1);
        this.updateNeighborsArrayForOneCell(row, col, row, col+1);
    }
    
    //update both sides - if neighbor cell is also 1 (this method will be called only if the current cell is black)
    this.updateNeighborsArrayForOneCell = function(row, col, neighborRow, neighborCol){
        if (neighborRow >= 0 && neighborRow < this.mD 
            && neighborCol >= 0 && neighborCol < this.nD
            && this.grid[neighborRow][neighborCol] != undefined && this.grid[neighborRow][neighborCol].bit == 1){

            this.grid[neighborRow][neighborCol].coloredConnectedNeighbors.push({i: row, j:col});
            this.grid[row][col].coloredConnectedNeighbors.push({i: neighborRow, j: neighborCol});
           
        }
    }
    
    //on bonus mode - for each cell - if changed to black - add it self to the neighbor lists
    //changed to white - removes itself 
    //doe not improve the coloring of the grid
    this.updateNeighborsArrayForBonus = function(row, col, neighborRow, neighborCol, bitValue){
        if (neighborRow >= 0 && neighborRow < this.mD 
            && neighborCol >= 0 && neighborCol < this.nD ){
            if (this.grid[neighborRow][neighborCol] == undefined){
                return;
            }
            if (bitValue == 1){
                this.grid[neighborRow][neighborCol].coloredConnectedNeighbors.push({i: row, j:col});
                this.grid[row][col].coloredConnectedNeighbors.push({i: neighborRow, j: neighborCol});
                
            }else{  // bit value is 0 - we need to remove this cell from it's neighbors
                for (var index =0; index < this.grid[neighborRow][neighborCol].coloredConnectedNeighbors.length; index++){
                    var pair = this.grid[neighborRow][neighborCol].coloredConnectedNeighbors[index];
                    if (pair.i == row && pair.j == col){
                        this.grid[neighborRow][neighborCol].coloredConnectedNeighbors.splice(index, 1);
                        break;
                    }
                }

            }
                 
        }
    }
    
    //run for each of the cell neighbors
    this.updateNeighborForBonus = function(row, col, bitValue){
        this.updateNeighborsArrayForBonus(row, col, row-1, col-1, bitValue);
        this.updateNeighborsArrayForBonus(row, col, row-1, col, bitValue);
        this.updateNeighborsArrayForBonus(row, col, row-1, col+1, bitValue);

        this.updateNeighborsArrayForBonus(row, col, row, col-1, bitValue);
        this.updateNeighborsArrayForBonus(row, col, row, col+1, bitValue);

        this.updateNeighborsArrayForBonus(row, col, row+1, col-1, bitValue);
        this.updateNeighborsArrayForBonus(row, col, row+1, col, bitValue);
        this.updateNeighborsArrayForBonus(row, col, row+1, col+1, bitValue);
    }
    
    this.getUpdatedGrid = function(){
        return this.grid;
    }

    //update the grid with different color for each island - return the number of islands
    this.findIslands = function(){
        this.numberOfIsland = 0;
        for (var row =0; row < this.mD; row++){
            for (var col =0; col < this.nD; col++){
                if (this.grid[row][col] == undefined){
                    continue;
                }
                var currentBit = this.grid[row][col];
//                currentBit.bit == 1 && 
                if (currentBit.htmlColor == 'black'){ // not black means - already been colored before
                    var color = this.generateRandomColor();
                    currentBit.htmlColor = color;
                    this.numberOfIsland++;
                    if (currentBit.coloredConnectedNeighbors.length>0){
                        this.paintNeighbors(color, currentBit.coloredConnectedNeighbors);
                    }
                }
            }
        }
          
        return this.numberOfIsland;
    }
    
    //changed the color of the cells in the same island to be the selected random color of the first cell
    this.paintNeighbors = function(newColor, neighbors){
        
        for (var index = 0; index < neighbors.length; index++){
            
            var pair = neighbors[index];
            var currentNeighbor = this.grid[pair.i][pair.j];
            
            if (currentNeighbor.htmlColor == 'black'){
                currentNeighbor.htmlColor = newColor;
                this.paintNeighbors(newColor, currentNeighbor.coloredConnectedNeighbors);
            }
            
        }
    }
        
    //generat random html color for the islands
    this.generateRandomColor = function(){
        var letters = '0123456789ABCDEF';
        var color = '#';
        for (var i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }
    
    //flip the bit value - by click on the bonus map
    this.flipBit = function(row, col){
        if (this.grid[row][col] == undefined){
            this.grid[row][col] = Bit(row, col, 1, 'black');
            this.updateNeighborForBonus(row, col, 1);
            
        }else{  //bit is 1
            this.grid[row][col] = undefined;
            this.updateNeighborForBonus(row, col, 0);
        }
        
        return this.grid;
    }

    
});