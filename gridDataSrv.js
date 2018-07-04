var app = angular.module('myApp', []);
    app.service('gridDataSrv', function () { 
    
    this.nD = 0;
    this.mD = 0;
        
    //creat bit object without color    
    function Bit(i,j) {
        var bit = {bit : 0, htmlColor: 'white', row : i, col : j, coloredConnectedNeighbors : [] };
        return bit;
    }
        
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
            for (var col = 0; col < this.nD; col++){
                
                this.grid[row][col] = Bit(row,col);
            }
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
            for (var col = 0; col < this.nD; col++){
                
                var bitValue = Math.floor(Math.random() * 6) -1;
                
                if (bitValue == 1){ 
                    this.grid[row][col] = Bit(row, col, 1, 'black');
                }else{
                    this.grid[row][col] = Bit(row, col, 0, 'white');
                }
            }
        }
        
        this.updateNeighbor();
        
        return this.grid;
    }
    
    
    //go over all bit in map - if  cell's color is black, add this cell to the neighbor array of it's neighbors 
    //(but only for the neighbors that are black too) not relevant for white cells - hep to reduce data
    
    this.updateNeighbor = function(){
         //update black neighbors only for balck cells - if my neighbor is black but im not - it's not relevant for me
        for (var row =0; row < this.mD; row++){
            for (var col =0; col < this.nD; col++){
                if (this.grid[row][col].bit == 1){ 
                    this.updateNeighborsArray(row, col, row-1, col-1);
                    this.updateNeighborsArray(row, col, row-1, col);
                    this.updateNeighborsArray(row, col, row-1, col+1);
                    
                    this.updateNeighborsArray(row, col, row, col-1);
                    this.updateNeighborsArray(row, col, row, col+1);
                    
                    this.updateNeighborsArray(row, col, row+1, col-1);
                    this.updateNeighborsArray(row, col, row+1, col);
                    this.updateNeighborsArray(row, col, row+1, col+1);
                }
            }
        }
    }
    
    this.updateNeighborsArray = function(row, col, neighborRow, neighborCol){//, ignoreWhite){
        if (neighborRow >= 0 && neighborRow < this.mD 
            && neighborCol >= 0 && neighborCol < this.nD
            && this.grid[neighborRow][neighborCol].bit == 1){
            
            this.grid[neighborRow][neighborCol].coloredConnectedNeighbors.push({i: row, j:col});
        }
    }
    
    this.getUpdatedGrid = function(){
        return this.grid;
    }

    //update the grid with different color for each island 0 return th number of islands
    this.findIslands = function(){
        this.numberOfIsland = 0;
        for (var row =0; row < this.mD; row++){
            for (var col =0; col < this.nD; col++){
                var currentBit = this.grid[row][col];
                if (currentBit.bit == 1 && currentBit.htmlColor == 'black'){
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
        if (this.grid[row][col].bit == 0){
            this.grid[row][col].bit = 1;
            this.grid[row][col].htmlColor = 'black';
        }else{  //bit is 1
            this.grid[row][col].bit = 0;
            this.grid[row][col].htmlColor = 'white';
        }
        return this.grid;
    }
    
  
    
    
});