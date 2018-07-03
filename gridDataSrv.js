var app = angular.module('myApp', []);
    app.service('gridDataSrv', function () { 
    
    this.nD = 0;
    this.mD = 0;
        
    function Bit(i,j) {
        var bit = {color : 0, row : i, col : j, coloredConnectedNeighbors : [] };
        return bit;
    }
    
    
    this.initBitMap = function (n,m) {
        this.nD = n;
        this.mD = m;
        this.grid = new Array(this.mD); //[this.mD];
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
                var newColor = Math.floor(Math.random() * 5) -1;
                
                if (newColor == 1){ 
                    this.grid[row][col].color = newColor;
                }else{
                    this.grid[row][col].color = 0;
                }
            }
        }
        
        //update black neighbors only for balck cells - if my neighbor is black but im not - it's not relevant for me
        for (var row =0; row < this.mD; row++){
            for (var col =0; col < this.nD; col++){
                if (this.grid[row][col].color == 1){ 
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
        if (this.grid.[neighborRow][neighborCol] == 1 &&
            neighborRow>=0 && neighborRow < this.mD && neighborCol >= 0 && neighborCol < this.nD){
            this.grid[neighborRow][neighborCol].coloredConnectedNeighbors.push(row+","+col);
        }
    }

    //update the grid with different color for each island 0 return th number of islands
    this.findIslands = function(){
        
    };
});