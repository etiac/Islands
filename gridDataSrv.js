var app = angular.module('myApp', []);
    app.service('gridDataSrv', function () { 
    
    this.nD = 0;
    this.mD = 0;
        
    function Bit(i,j) {
        var bit = {bit : 0, htmlColor: 'white', row : i, col : j, coloredConnectedNeighbors : [] };
        return bit;
    }
    
    
    this.initBitMap = function (n,m) {
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
    
    this.initIslands = function(){
        for (var row =0; row < this.mD; row++){
            for (var col = 0; col < this.nD; col++){
                var newColor = Math.floor(Math.random() * 6) -1;
                
                if (newColor == 1){ 
                    this.grid[row][col].bit = newColor;
                    this.grid[row][col].htmlColor = 'black';
                }else{
                    this.grid[row][col].bit = 0;
                    this.grid[row][col].htmlColor = 'white';
                }
            }
        }
        
        //update black neighbors only for balck cells - if my neighbor is black but im not - it's not relevant for me
        for (var row =0; row < this.mD; row++){
            for (var col =0; col < this.nD; col++){
                if (this.grid[row][col].bit == 1){ 
                    this.updateNeighbors(row, col, row-1, col-1);
                    this.updateNeighbors(row, col, row-1, col);
                    this.updateNeighbors(row, col, row-1, col+1);
                    
                    this.updateNeighbors(row, col, row, col-1);
                    this.updateNeighbors(row, col, row, col+1);
                    
                    this.updateNeighbors(row, col, row+1, col-1);
                    this.updateNeighbors(row, col, row+1, col);
                    this.updateNeighbors(row, col, row+1, col+1);
                }
            }
        }
        return this.grid;
    }
        
    this.updateNeighbors = function(row, col, neighborRow, neighborCol){
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
                console.log("row " + row + " , col " + col );
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
        
    this.generateRandomColor = function(){
        var letters = '0123456789ABCDEF';
        var color = '#';
        for (var i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }
    
    
});