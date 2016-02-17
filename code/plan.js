// Fill the empty space with the minimum number of rectangles.
// (Rectangles should not overlap each other or walls.)
// The grid size is 1 meter, but the smallest wall/floor tile is 4 meters.
// Check the blue guide button at the top for more info.
// Make sure to sign up on the home page to save your code.
(function(window) {
  if (window.GridMancer === undefined) {
    var GridMancer = function(width, height, tileSize) {
      /*var isCanvasElement = !!(drawingElement.getContext && drawingElement.getContext("2d"));
      
      if (!isCanvasElement) {
        throw "The element with id '" + drawingElementId + "' isn't canvas element or the browser doesn't support canvas element.";
      }*/
      
      this.originalGrid = [];
      this.grid = [];
      this.width = width;
      this.height = height;
      this.tileSize = tileSize;
      this.nextRectId = 1;
    //  this.drawingElement = window.document.getElementById(drawingElementId);
    };
    GridMancer.prototype.createGrid = function() {
      var x, y;
      
      for (y = 0; y < this.height; y++) {
        this.grid[y] = [];
        this.originalGrid[y] = [];
        
        for (x = 0; x < this.width; x++) {
          this.grid[y][x] = -1;
        }
        
        this.originalGrid[y] = this.grid[y].slice(0);
      }
    };
    GridMancer.prototype.createTestRectangles = function(rectangles) {
      var x, y, i, 
          rectanglesLength = rectangles.length;
      
      if (Object.prototype.toString.call(rectangles) === "[object Array]") {
        for (i = 0; i < rectanglesLength; i++) {
          if (rectangles[i].length === 4) {
            for (x = rectangles[i][0]; x < rectangles[i][1]; x++) {
              for (y = rectangles[i][2]; y < rectangles[i][3]; y++) {
                this.grid[y][x] = 0;
              }
            }
          }
        }
      }
    };
    GridMancer.prototype.createRectangles = function() {
      var x, y, limitX, counterY,
        height = this.grid.length,
        width = this.grid[0].length,
        maxTilesPerLine = width / this.tileSize,
      
      // Starting tile.
      startTile,
      
      // Rectangle width.
      rectWidth,
      
      // Maximum number of tiles per current line (it depends on the starting tile),
      maxTiles,
      
      // Random number of tiles per line (it depends on rectangle x coordinate and tile size).
      randTiles,
      
      // Random starting tile (it cannot be higher then the maximum 
      // number of tiles per line of the grid minus tileSize).
      randStartTile,
      
      // The number of tiles that the new rectangle has.
      tilesCount;
      
      for (var y = 0; y + this.tileSize < height; y += this.tileSize) {
        randStartTile = Math.random() * (maxTilesPerLine - this.tileSize);
        startTile = Math.round(randStartTile);
        maxTiles = maxTilesPerLine - startTile;
        randTiles = Math.random() * maxTiles;
        tilesCount = Math.round(randTiles);

        if (tilesCount === 0) {
          tilesCount = 1;
        }       
        
        limitX = startTile * this.tileSize + tilesCount * this.tileSize;
        
        for (counterY = 0; counterY < this.tileSize; counterY++) {
          for (x = startTile * this.tileSize; x < limitX; x++) {
            this.grid[y + counterY][x] = 0;
          }
        }
      }
    };
    GridMancer.prototype.isOccupied = function(x, y) {
      // The value greater then 0 at the given coordinates (x,y) indicates
      // that the position is alredy occupied.
      return y < this.grid.length && x < this.grid[0].length && this.grid[y][x] > 0;
    };
    GridMancer.prototype.isOutOfPath = function(x, y) {
      // The value of -1 at the given coordinates (x,y) indicates
      // that the position is not accessible.
      return y >= this.grid.length || x >= this.grid[0].length || this.grid[y][x] === -1;
    };
    GridMancer.prototype.findLastPoint = function(x, y, incX, incY, fnCheck) {
      while (fnCheck(x, y)) {
        x += incX;
        y += incY;
      }
      
      return {
        x: x,
        y: y
      };
    };
    GridMancer.prototype.findNextDiagonalPoint = function (x, y, maxHorizontal, maxVertical) {
      var fnCheckIsLastPointNotReached = (function(that) {
            return function(x, y) {
              return x < that.width && y < that.height && !(that.isOutOfPath(x, y) || that.isOccupied(x, y))
            };
          })(this),
          mostHorizontalPoint = this.findLastPoint(x, y, this.tileSize, 0, fnCheckIsLastPointNotReached),
          mostVerticalPoint = this.findLastPoint(x, y, 0, this.tileSize, fnCheckIsLastPointNotReached),
          //mostLeftHorizontalPoint = this.findLastPoint(x, y, -this.tileSize, 0, fnCheckIsLastPointNotReached),
          nextX = x + this.tileSize,
          nextY = y + this.tileSize,
          coordinates = {
            maxH: {
              x: Math.min(mostHorizontalPoint.x, maxHorizontal),
              y: mostHorizontalPoint.y
            },
            maxV: {
              x: mostVerticalPoint.x,
              y: Math.min(mostVerticalPoint.y, maxVertical)
            },
            maxD: {
              x: nextX,
              y: nextY
            },
          };
          
      while (!this.isOccupied(coordinates.maxD.x, coordinates.maxD.y) && 
             !this.isOutOfPath(coordinates.maxD.x, coordinates.maxD.y) && 
              coordinates.maxD.x < coordinates.maxH.x && 
              coordinates.maxD.y < coordinates.maxV.y) {
          coordinates = this.findNextDiagonalPoint(coordinates.maxD.x, coordinates.maxD.y, 
            coordinates.maxH.x, coordinates.maxV.y);
      }
      
      return coordinates;
    };
    GridMancer.prototype.addRect = function(x, y, width, height) {
      var limitX = x + width,
          limitY = y + height,
          tempY;
       
      for (; x < limitX; x++) {
        for (tempY = y; tempY < limitY; tempY++) {
          this.grid[tempY][x] = this.nextRectId;
        }
      }
      
      this.nextRectId++;
    };
    GridMancer.prototype._drawGrid = function(grid, containerId) {
      var x, y, newDiv, newSpan,
          document = window.document,
          containerElement = document.getElementById(containerId);
        
      for (y = 0; y < this.height; y++) {
        newDiv = document.createElement("div");
        newDiv.className = "line";
        
        for (x = 0; x < this.width; x++) {
          label = document.createElement("span");
          label.innerHTML = grid[y][x];
          newDiv.appendChild(label);
        }
        
        containerElement.appendChild(newDiv);
      }
    };
    GridMancer.prototype.drawOriginalGrid = function(containerId) {
      this._drawGrid(this.originalGrid, containerId);
    };
    GridMancer.prototype.drawGrid = function(containerId) {
      this._drawGrid(this.grid, containerId);
    };
    GridMancer.prototype.findSolution = function() {
      var x, y, newY, coordinates;
      for (y = 0; y < this.grid.length; y += this.tileSize) {
        for (x = 0; x < this.grid[0].length; x += this.tileSize) {
          if (!this.isOccupied(x, y) && !this.isOutOfPath(x, y)) {
            coordinates = this.findNextDiagonalPoint(
              x, y, Number.MAX_VALUE, Number.MAX_VALUE);
            
            if (coordinates.maxH.x > coordinates.maxD.x && coordinates.maxV.y > coordinates.maxD.y) {
              newY = coordinates.maxD.y;
            } else {
              newY = coordinates.maxV.y;
            }
            
            while (x - this.tileSize >= 0 && newY - this.tileSize >= 0 && 
               (!this.isOccupied(x - this.tileSize, newY - this.tileSize) &&
               !this.isOutOfPath(x - this.tileSize, newY - this.tileSize)) &&
               (!this.isOccupied(coordinates.maxH.x, newY - this.tileSize) &&
               !this.isOutOfPath(coordinates.maxH.x, newY - this.tileSize))) {
              newY -= this.tileSize;
            }
            
            if (newY == y) {
              newY += this.tileSize;
            }
            
            this.addRect(x, y, coordinates.maxH.x - x, newY - y);
          }
        }
      }
    };
    
    window.GridMancer = GridMancer;
  }
})(window);
