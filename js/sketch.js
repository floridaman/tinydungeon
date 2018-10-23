var current;
var stack=[];
var cols, rows
var w = 10; //width of tiles
var tiles = [];
var currentColor,visistedColor;

function setup() {
    //frameRate(20);
    createCanvas(500,500);
    cols = floor(width/w);
    rows = floor(height/w);

    currentColor = color(255,255,0);
    visistedColor = color(0,255,255);
    stackColor = color(255,0,255);

    for (let y=0; y < rows; y++) {
        for (let x=0; x < cols; x++){
            let tile = new Tile(x,y);
            tiles.push(tile);
        }
    }

    current = tiles[getRndInteger(0,tiles.length-1)];
}

function draw() {
    background(100);
    for (var i=0; i<tiles.length; i++) {
        tiles[i].display();
    }
    
    current.visited = true;
    current.highlight();

    var next =  current.checkNeighbours();
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

    this.highlight = function(){
        let x = this.x * w;
        let y = this.y * w;
        noStroke();
        fill(currentColor);
        rect(x, y, w, w);
    };

    this.display = function(){
        var x = this.x * w;
        var y = this.y * w;

        if(this.visited){
            noStroke();
            fill(visistedColor);
            rect(x, y, w, w);
        }

        if(this.stack){
            //noStroke();
            fill(stackColor);
            rect(x, y, w, w);
        }

        stroke(0);
        if(this.walls.n){
            line(x, y, x+w, y);
        }
        if(this.walls.e){
            line(x+w, y, x+w, y+w);
        }
        if(this.walls.s){
            line(x+w, y+w, x, y+w);
        }
        if(this.walls.w){
            line(x, y+w, x, y);
        }
    }

    this.checkNeighbours = function(){
        let neighbours = [];

        let north = tiles[index(x, y - 1)];
        let east = tiles[index(x + 1, y)];
        let south = tiles[index(x, y + 1)];
        let west = tiles[index(x - 1, y)];

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
    var x = a.x - b.x;
    if(x === 1){
        a.walls.w = false;
        b.walls.e = false;
    } else if(x === -1){
        a.walls.e = false;
        b.walls.w = false;
    }

    var y = a.y - b.y;
    if(y === 1){
        a.walls.n = false;
        b.walls.s = false;
    } else if(y === -1){
        a.walls.s = false;
        b.walls.n = false;
    }
}