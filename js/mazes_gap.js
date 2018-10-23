var grid = [];
var visited = [];
var stack = [];

var width = 50; //columns
var height = 50; //rows
var size = 10; //cell size in pixels

var current; //current cell

var directions = ["n","e","s","w"]; //

var canvas = document.getElementById("maze1");
var ctx = canvas.getContext("2d");

var stepCountHolder = document.getElementById("stepCount");
var iterations;

ctx.canvas.width = (width + 1) * size;
ctx.canvas.height = (height + 1) * size;
ctx.scale(10,10);

let initial = [1,2];
ctx.fillStyle = "#FFFFFF";

generateMaze();



function generateMaze(){
    iterations = 0;
    stepCountHolder.innerText = "0";

    for(let x=0; x<width; x++){
        visited[x] = [];
    }

    let table = document.getElementById("maze1_wall_table");
    for (let y=0; y<height; y++){
        let row = table.insertRow(-1);
        for (let x=0; x<width; x++){
            visited[x][y] = 0;
            let cell = row.insertCell(-1);
            cell.innerHTML = "1";
        }
    }

    current = initial;
    visited[current[0]][current[1]] = 1;

    ctx.fillStyle = "#000000"
    ctx.fillRect(0,0,ctx.canvas.width,ctx.canvas.height);
}

function dig(steps){
    if(steps == 0){
        return true;
    }else if((current == initial && iterations > 0)){
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(current[0],current[1],1,1);
        let startEnd = getRandStartEnd();
        console.log(startEnd);
        ctx.fillStyle = "#00FF00";
        ctx.fillRect(startEnd[0][0],startEnd[0][1],1,1);
        ctx.fillStyle = "#FF0000";
        ctx.fillRect(startEnd[1][0],startEnd[1][1],1,1);
        return true;
    } else {
        let validNeighbor = checkNeighbors(current[0],current[1]);
        if (validNeighbor){
            //console.log(validNeighbor);

            //push current to stack
            stack.push(current);

            //make new the current and mark as visited
            current = validNeighbor;
            visited[current[0]][current[1]] = 1;
        } else{
            //pop cell from stack and make current cell
            current = stack.pop();
        }
        steps--;
        iterations++;
        stepCountHolder.innerText = iterations;
        ctx.fillStyle = "#FF0000";
        ctx.fillRect(current[0],current[1],1,1);
        dig(steps);
    }
}


function checkNeighbors(x,y) {
    let neighbor;
    let i = 0;
    let dirs = directions.slice(0);
    let direction = shuffle(dirs);
    let neighbors = {
        n: [x,y - 3],
        e: [x+2,y],
        s: [x,y+3],
        w: [x-2,y],
    };

    let walls = {
        n: [x,y - 1],
        n2: [x,y - 2],
        e: [x+1,y],
        s: [x,y+1],
        s2: [x,y+2],
        w: [x-1,y],
    };

    do{
        let dir = direction.pop();
        if (!dir){
            return
        }
        let nx = neighbors[dir][0];
        let ny = neighbors[dir][1];

        let wx = walls[dir][0];
        let wy = walls[dir][1];
        let wx2,wy2;
        if((dir === 'n') || (dir === 's')){
            wx2 = walls[dir+'2'][0];
            wy2 = walls[dir+'2'][1];
        }

        if (visited[nx]){
            if (visited[nx][ny] == 0){ //if unvisited
                neighbor = [nx,ny];
                visited[wx][wy] = 1;
                ctx.fillStyle = "#FFFFFF";
                if((dir === 'n') || (dir === 's')) {
                    visited[wx2][wy2] = 1;
                    ctx.fillRect(wx2,wy2,1,1);
                }
                //remove wall between cell and new
                ctx.fillRect(wx,wy,1,1);
                //ctx.fillStyle = "#FF0000";
                //ctx.fillRect(nx,ny,1,1);
                //console.log("unvisited neighbor found @ " + nx + "," + ny + " " + dir +" of current cell @ " + x + ","+ y);
            }
        }
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(x,y,1,1);


    } while(!neighbor && direction.length>0)
    return neighbor
}

function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

function getRandStartEnd(){
    let perim = (width * 2) + (height * 2);
    let wallArray = [];

    for (let x=0; x < width; x++) {
        for (let y=0; y < height; y++){
            if (x == 0 || x == width || y == 0 || y==height){
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