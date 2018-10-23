var current;
var stack=[];
var cols, rows
var w = 10; //width of tiles
var tiles = [];
var currentColor,visistedColor;

function setup() {
    //frameRate(20);
    createCanvas(510,510);
    cols = floor(width/w);
    rows = floor(height/w);

    currentColor = color(255,255,0);
    visistedColor = color(0,255,255);
    stackColor = color(255,0,255);
    wallColor = color(100);

    for (let y=0; y < rows; y++) {
        for (let x=0; x < cols; x++){
            let tile = new Tile(x,y);
            tiles.push(tile);
        }
    }

    //current = tiles[getRndInteger(0,tiles.length-1)];
    current = tiles[cols + 1];
}

function draw() {
    background(100);

    for (var i=0; i<tiles.length; i++) {
        tiles[i].display();
    }

    current.visited = true;
    current.wall = false;
    let next =  current.checkNeighbours();
    if(next){
        next.visited = true;
        current.stack = true;
        stack.push(current);
        removeWalls(current, next);
        current = next;
    } else if (stack.length > 0){
        current = stack.pop();
        current.stack = false;
    }

    for (var i=0; i<tiles.length; i++) {
        tiles[i].display();
    }
}

function Tile(x,y) {
    this.x = x;
    this.y = y;
    this.visited = false;
    this.wall = true;
    this.walls = {
        n: true,
        e: true,
        s: true,
        w: true,
    };

    this.display = function(){
        let x = this.x * w;
        let y = this.y * w;


        noStroke();

        if (this.wall){
            fill(wallColor);
            rect(x, y, w, w);
        }
        else {
            fill(visistedColor);
            rect(x, y, w, w);
        }

        if(this === current){
            stroke(0);
            fill(currentColor);
            rect(x, y, w, w);
        }



    };

    this.checkNeighbours = function(){
        let neighbours = [];

        let north = tiles[index(x, y-2)];
        let east = tiles[index(x + 2, y)];
        let south = tiles[index(x, y + 2)];
        let west = tiles[index(x - 2, y)];

        let ne = tiles[index(x+1, y-1)];
        let se = tiles[index(x+1, y+1)];
        let sw = tiles[index(x-1, y+1)];
        let nw = tiles[index(x-1, y-1)];


        if (ne != undefined){
            ne.wall = true;
        }

        if (se != undefined){
            se.wall = true;
        }
        if (sw != undefined){
            sw.wall = true;
        }
        if (nw != undefined){
            nw.wall = true;
        }


        if(north && !north.visited){
            neighbours.push(north);
        }
        if(east && !east.visited){
            neighbours.push(east);
        }
        if(south && !south.visited){
            neighbours.push(south);
        }
        if(west && !west.visited){
            neighbours.push(west);
        }

        if(neighbours.length > 0){
            let r = floor(random(0, neighbours.length));
            return neighbours[r];
        } else{
            return undefined;
        }
    }
}

function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1) ) + min;
}

function index(x, y){
    if(x < 0 || y < 0 || x > cols-1 || y > rows-1){
        return -1;
    }
    return x + y * cols;
}

function removeWalls(a, b){
    let x = a.x - b.x;
    if(x === 2){ //west
        a.walls.w = false;
        b.walls.e = false;

        let west = tiles[index(a.x - 1, a.y)];
        if(west != undefined){
            west.wall = false;
        }

    } else if(x === -2){ //east
        a.walls.e = false;
        b.walls.w = false;

        let east = tiles[index(a.x + 1, a.y)];
        if(east != undefined){
            east.wall = false;
        }
    }

    let y = a.y - b.y;
    if(y === 2){ //north
        a.walls.n = false;
        b.walls.s = false;

        let north = tiles[index(a.x, a.y-1)];
        if(north != undefined){
            north.wall = false;
        }
    } else if(y === -2){ //south
        a.walls.s = false;
        b.walls.n = false;

        let south = tiles[index(a.x, a.y + 1)];
        if(south != undefined){
            south.wall = false;
        }
    }
}

function removeCorridors(){
    for (let i=0;i<tiles.length;i++){
        let wallCount = 0;
        Object.keys(tiles[i].walls).forEach(function(k, j) {
            if (tiles[i].walls[k]) {
                wallCount++;
            }
        });

        if (wallCount == 3){
            tiles[i].wall = true;
        }
    }
}