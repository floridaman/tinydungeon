var grid = [];
var visited = [];
var stack = [];
var bitMap = [];

var width = 25; //columns
var height = 25; //rows
var size = 25; //cell size in pixels

var current; //current cell

var directions = ["n","e","s","w"]; //

var canvas = document.getElementById("maze1");
var ctx = canvas.getContext("2d");

var stepCountHolder = document.getElementById("stepCount");
var iterations;

ctx.canvas.width = (width) * size;
ctx.canvas.height = (height) * size;
ctx.scale(size,size);

let initial = [1,2];
//ctx.fillStyle = "#FFFFFF";

//build floor array
let floorImg = [];
let floorImages = ['floor1','floor2','floor3'];

for (let img in floorImages){
    let imgObj = new Image();
    imgObj.src = floorImages[img] + '.png';
    floorImg.push(imgObj);
}

function getRndFloorImg(){
   let rand = getRndInteger(0,floorImg.length - 1);
   return floorImg[rand];
}

var wallDict = {
    'n': 1,
    'e': 2,
    's': 4,
    'w': 8,
    'np': 16,
    'ep': 32,
    'sp': 64,
    'wp': 128,
    'f': 256,
    'wall':512,
};

var tileDict = {
    nwp: {
       mask: wallDict.np | wallDict.wp,
        image: 'perimeter_nw.png',
    },
    np: {
        mask: wallDict.np,
        image: 'perimeter_n.png',
    },
    nep: {
        mask: wallDict.np | wallDict.ep,
        image: 'perimeter_ne.png',
    },
    ep: {
        mask: wallDict.ep,
        image: 'perimeter_e.png',
    },
    sep: {
        mask: wallDict.sp | wallDict.ep,
        image: 'perimeter_se.png',
    },
    sp: {
        mask: wallDict.sp,
        image: 'perimeter_s.png',
    },
    swp: {
        mask: wallDict.sp | wallDict.wp,
        image: 'perimeter_sw.png',
    },
    wp: {
        mask: wallDict.wp,
        image: 'perimeter_w.png',
    },
    ew: {
        mask: wallDict.e | wallDict.w,
        image: 'ew.png',
    },
    ns: {
        mask: wallDict.n | wallDict.s,
        image: 'ns.png',
    },
    front: {
        mask: wallDict.f,
        image: 'front.png',
    },
};

for(let tileType in tileDict){
    let tile = tileDict[tileType];
    let imageString = tile.image;
    tile.image = new Image();
    tile.image.src = imageString;
}

/*
◼◼◼
◼◼◼
◼◼◼
*/

/*
◻◻◻
◻◼◼
◻◼◻
*/

/*
◻◻◻
◼◼◼
◻◻◻
*/

/*
◻◻◻
◼◼◼
◻◼◻
*/

/*
◻◼◻
◼◼◼
◻◻◻
*/

/*
◻◻◻
◼◼◻
◻◼◻
*/

/*
◻◼◻
◼◼◻
◻◻◻
*/

/*
◻◼◻
◻◼◼
◻◻◻
*/

/*
◻◻◻
◻◻◻
◼◼◼
*/

function getTile(x,y){
    let maskValue = checkNeighbor(x,y);
    let img;

    console.log("(" + x + "," + y + ") " + maskValue);

    if((maskValue & tileDict.nwp.mask) === tileDict.nwp.mask){
        img=tileDict.nwp.image;
    }else if((maskValue & tileDict.nep.mask) === tileDict.nep.mask){
        img=tileDict.nep.image;
    }else if((maskValue & tileDict.sep.mask) === tileDict.sep.mask) {
        img = tileDict.sep.image;
    }else if((maskValue & tileDict.swp.mask) === tileDict.swp.mask) {
        img = tileDict.swp.image;
    }else if((maskValue & tileDict.np.mask) === tileDict.np.mask){
        img=tileDict.np.image;
    }else if((maskValue & tileDict.ep.mask) === tileDict.ep.mask){
        img=tileDict.ep.image;
    }else if((maskValue & tileDict.sp.mask) === tileDict.sp.mask){
        img=tileDict.sp.image;
    }else if((maskValue & tileDict.wp.mask) === tileDict.wp.mask){
        img=tileDict.wp.image;
    }else if(((maskValue & tileDict.front.mask) === tileDict.front.mask) && ((maskValue & wallDict.s) !== wallDict.s)){
        img=tileDict.front.image;
    }else if((maskValue & tileDict.ns.mask) === tileDict.ns.mask){
        img=tileDict.ns.image;
    }else if((maskValue & tileDict.ew.mask) === tileDict.ew.mask){
        img=tileDict.ew.image;
    }else {
        //img = getRndFloorImg();
    }
    if((maskValue & wallDict.wall) !== wallDict.wall){
        img = getRndFloorImg();
    }

    if(img){
        ctx.drawImage(img,x,y,1,1)
    }
}

function drawMaze() {
    for (let y=0; y<=height - 1; y++){
        for (let x=0; x<=width - 1; x++) {
            getTile(x,y);
            if(visited[x][y]){
                ctx.globalAlpha = 0.2;
                ctx.fillStyle = "#FFFF00";
                ctx.fillRect(x,y,1,1);
                ctx.globalAlpha = 1;
            }
        }
    }

}

function checkNeighbor(x,y){
    let mask = bitMap[x][y];
    let neighbors = [];
    let directionDict = {
        n: [x,y - 2],
        e: [x+1,y],
        s: [x,y+2],
        w: [x-1,y],
    };

    let walls = {
        n: [x,y - 1],
        n2: [x,y - 2],
        e: [x+1,y],
        s: [x,y+1],
        s2: [x,y+2],
        w: [x-1,y],
    };

    if (x == 0){
        mask = mask | wallDict.wp;
    }

    if (x == width - 1){
        mask = mask | wallDict.ep;
    }

    if (y == 0){
        mask = mask | wallDict.np;
    }

    if (y == height - 1){
        mask = mask | wallDict.sp;
    }

    if(!visited[x][y]){
        mask = mask | wallDict.wall;
    }

    for(let direction in directionDict){
        let tempMask;
        let neighborCoord = directionDict[direction];
        let northWallCoord = walls[direction];
        let nx = neighborCoord[0];
        let ny = neighborCoord[1];

        let nwx = northWallCoord[0];
        let nwy = northWallCoord[1];

        if(direction === 'n' && ((bitMap[nwx][nwy] & wallDict.wall) === wallDict.wall) && ((bitMap[nwx][nwy] & tileDict.front.mask) !== tileDict.front.mask)){
            mask = mask | wallDict.f;
        }

        if ((nx < 0 || nx > width-1) || (ny < 0 || ny > height-1)){

        } else{

            let neighbor = visited[neighborCoord[0]][neighborCoord[1]];
            if (!visited[nx][ny]){
                tempMask = wallDict[direction];
            }
            mask = mask | tempMask;
        }
    }
    bitMap[x][y]=mask;
    return mask;
}


generateMaze();



function generateMaze(){
    iterations = 0;
    stepCountHolder.innerText = "0";

    for(let x=0; x<width; x++){
        visited[x] = [];
        bitMap[x] = [];
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
    //ctx.fillRect(0,0,ctx.canvas.width,ctx.canvas.height);
    visited[current[0]][current[1]] = 1;
    dig();
    drawMaze();
}

function dig(){
    let validNeighbor = checkNeighbors(current[0],current[1]);
    if (validNeighbor){
        //push current to stack
        stack.push(current);

        //make new the current and mark as visited
        current = validNeighbor;
        visited[current[0]][current[1]] = 1;
    } else{
        //pop cell from stack and make current cell
        if (stack.length>0){
            current = stack.pop();
        } else{
            return
        }
    }
    iterations++;
    stepCountHolder.innerText = iterations;
    dig();
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

                if((dir === 'n') || (dir === 's')) {
                    visited[wx2][wy2] = 1;
                }

                //remove wall between cell and new
                //ctx.drawImage(getRndFloorImg(),wx,wy,1,1)
            }
        }

    } while(!neighbor && direction.length>0);

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