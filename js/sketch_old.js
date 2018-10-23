var startEnd;
var perimeterColor,wallColor,startColor,endColor,currentColor;

var current;

var stack=[];

//new vars
var cols, rows
var w = 10; //width of tiles
var tiles = [];


function setup() {
    frameRate(20);
    createCanvas(500, 500);
    cols = floor(width/w);
    rows = floor(height/w);

    startEnd = getRandStartEnd();
    perimeterColor = color(0);
    wallColor = color(100);
    startColor = color(0,255,0);
    endColor = color(255,0,0);
    currentColor = color(255,255,0);

    let i = 0;
    for (let x=0; x < width; x+=10) {
        for (let y=0; y < height; y+=10){
            let tile = new Tile(x,y);
            let neighbors = [];
            tile.index = i;
            let arr = [x,y];

            let north = i;
            let south = i;
            let east = i + width/10;
            let west = i - width/10;

            neighbors = [north,south,east,west];
            tile.neighbors = neighbors;


            //if start location add to visited cells
            if (arr.every(function(v,i) { return v === startEnd[0][i]})) {
                currentCell = i;
                tile.visited = true;
                visitedCells.push(i);
                //if perimeter add to visited cells
            } else if (x == 0 || x == width - 10 || y == 0 || y==height-10){
                visitedCells.push(i);
                tile.visited = true;
            } else {
                unvisited.push(i);
                tile.visited = false;
            }
            tiles.push(tile);
            i++;
        }
    }

    noLoop();
    setTimeout(update, 500);
}

function draw() {
    //iterate unvisited tiles
    for (var i=0; i<unvisited.length; i++) {
        let tile = tiles[unvisited[i]];
        fill(wallColor);
        tile.display();
    }

    for (let i = 0;i<visitedCells.length; i++){
        let tile = tiles[visitedCells[i]];
        fill(255);
        tile.display();
    }

    for (var i=0; i<visitedCells.length; i++) {
        let tile = tiles[visitedCells[i]];
        let x = tile.x;
        let y = tile.y;

        if (x == startEnd[0][0] && y == startEnd[0][1]){
            fill(startColor);
        } else if (x == startEnd[1][0] && y == startEnd[1][1]){
            fill(endColor);
        }
        else if(x == 0 || x == width - 10 || y == 0 || y==height-10){
            fill(perimeterColor);
        }

        if(tile.index == currentCell){
            fill(currentColor);
        }
        tile.display();
    }

    console.log(stack);


}

function update() {
    if (unvisited.length > 0){
        let current = tiles[currentCell];
        if (current.neighbors.length > 0){
            let neighbor;
            do {
                rand = getRndInteger(0,(current.neighbors.length - 1));
                let index = current.neighbors.splice(rand,1);
                console.log(index);
                neighbor = tiles[index];
            } while(neighbor.visited && current.neighbors.length > 0);
            neighbor.visited = true;

            stack.push(currentCell);
            currentCell = neighbor.index;
            unvisited.splice(unvisited.indexOf(neighbor.index),1);
            visitedCells.push(neighbor.index);

        } else if (stack.length != 0){
            let cell = stack.pop();
            currentCell = cell;
        }
        redraw();
    }
    update();
}


function Tile(x,y) {
    this.x = x;
    this.y = y;
    this.visited = false;
    this.walls = {
        n: true,
        e: true,
        s: true,
        w: true,
    };

    this.display = function () {
        rectangle = rect(x,y,10,10);
    }
}

function getRandStartEnd(){
    let perim = (width * 2) + (height * 2);
    let wallArray = [];

    for (let x=0; x < width; x+=10) {
        for (let y=0; y < height; y+=10){
            if (x == 0 || x == width - 10 || y == 0 || y==height-10){
                wallArray.push([x,y]);
            }
        }
    }
    let rand = getRndInteger(0, wallArray.length);
    let rand2;
    do {
        rand2 = getRndInteger(0, wallArray.length);
    } while(rand === rand2);
    return [wallArray[rand],wallArray[rand2]];
}

function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1) ) + min;
}

function mousePressed() {
    //start();
}
