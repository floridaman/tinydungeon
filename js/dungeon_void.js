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

//debug canvas
var debugCanvas = document.getElementById("debug-overlay");
var debugCtx = debugCanvas.getContext("2d");

debugCtx.canvas.width = (width) * size;
debugCtx.canvas.height = (height) * size;
debugCtx.scale(size,size);
//end debug canvas

let initial = [0,0];
ctx.fillStyle = "#000000";
ctx.fillRect(0,0,ctx.canvas.width,ctx.canvas.height);

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

var pathDict = {
    'n': 1,
    'e': 2,
    's': 4,
    'w': 8,
    'f': 16,
    'path':32,
};

var tileDict = {
    n:{
        mask: pathDict.n | pathDict.path,
        image: 'tiles/n.png',
    },
    e:{
        mask: pathDict.e  | pathDict.path,
        image: 'tiles/e.png',
    },
    s:{
        mask: pathDict.s | pathDict.path,
        image: 'tiles/s.png',
    },
    w:{
        mask: pathDict.w  | pathDict.path,
        image: 'tiles/w.png',
    },
    ne: {
        mask: pathDict.n | pathDict.e | pathDict.path,
        image: 'tiles/ne.png',
    },
    se: {
        mask: pathDict.s | pathDict.e | pathDict.path,
        image: 'tiles/se.png',
    },
    sw: {
        mask: pathDict.s | pathDict.w | pathDict.path,
        image: 'tiles/sw.png',
    },
    nw: {
        mask: pathDict.n | pathDict.w | pathDict.path,
        image: 'tiles/nw.png',
    },
    ew: {
        mask: pathDict.e | pathDict.w,
        image: 'tiles/ew.png',
    },
    ns: {
        mask: pathDict.n | pathDict.s,
        image: 'tiles/ns.png',
    },
    front: {
        mask: pathDict.f,
        image: 'tiles/front_s.png',
    },
    tn: {
        mask: pathDict.n | pathDict.e | pathDict.w | pathDict.path,
        image: 'tiles/t_n.png',
    },
    te: {
        mask: pathDict.n | pathDict.e | pathDict.s | pathDict.path,
        image: 'tiles/t_e.png',
    },
    ts: {
        mask: pathDict.s | pathDict.e | pathDict.w | pathDict.path,
        image: 'tiles/t_s.png',
    },
    tw: {
        mask: pathDict.n | pathDict.s | pathDict.w | pathDict.path,
        image: 'tiles/t_w.png',
    },
};

tileDict.perspective = {
    mask: tileDict.ew.mask | tileDict.n.mask,
        image: 'tiles/none.png',
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

    if((maskValue & pathDict.path) !== pathDict.path){
        if((maskValue & tileDict.front.mask) === tileDict.front.mask){
            img=tileDict.front.image;
        }
    }
    else if((maskValue & tileDict.tn.mask) === tileDict.tn.mask){
        img=tileDict.tn.image;
    }
    else if((maskValue & tileDict.te.mask) === tileDict.te.mask){
        img=tileDict.te.image;
    }
    else if((maskValue & tileDict.ts.mask) === tileDict.ts.mask){
        img=tileDict.ts.image;
    }
    else if((maskValue & tileDict.tw.mask) === tileDict.tw.mask){
        img=tileDict.tw.image;
    }
    else if(maskValue === tileDict.n.mask){
        img=tileDict.n.image;
    }
    else if(maskValue === tileDict.e.mask){
        img=tileDict.e.image;
    }
    else if(maskValue === tileDict.s.mask){
        img=tileDict.s.image;
    }
    else if(maskValue === tileDict.w.mask){
        img=tileDict.w.image;
    }
    else if(maskValue === tileDict.ne.mask){
        img=tileDict.ne.image;
    }
    else if(maskValue === tileDict.se.mask){
        img=tileDict.se.image;
    }
    else if(maskValue === tileDict.sw.mask){
        img=tileDict.sw.image;
    }
    else if(maskValue === tileDict.nw.mask){
        img=tileDict.nw.image;
    }
    else if((maskValue & tileDict.ew.mask) === tileDict.ew.mask){
        img=tileDict.ew.image;
    }else if((maskValue & tileDict.ns.mask) === tileDict.ns.mask){
        img=tileDict.ns.image;
    }
    else if ((maskValue & pathDict.wall) !== pathDict.wall){
        //img=getRndFloorImg();
    }

    if(img){
        ctx.drawImage(img,x,y,1,1)
    }
}

function drawMaze() {
    for (let y=0; y<=height - 1; y++){
        for (let x=0; x<=width - 1; x++) {
            if(visited[x][y]){
                debugCtx.globalAlpha = 0.1;
                debugCtx.fillStyle = "#FFFF00";
                //debugCtx.fillRect(x,y,1,1);
                debugCtx.globalAlpha = 1;
            }
            getTile(x,y);
        }
    }

}

function checkNeighbor(x,y){
    let mask = bitMap[x][y];
    let directionDict = {
        n: [x,y - 2],
        e: [x+1,y],
        s: [x,y+2],
        w: [x-1,y],
    };

    let walls = {
        n: [x,y - 1],
        //n2: [x,y - 2],
        e: [x+1,y],
        s: [x,y+1],
        //s2: [x,y+2],
        w: [x-1,y],
    };

    if(visited[x][y]){
        mask = mask | pathDict.path;
    } else{
        mask = 0;
        let wallCoord = walls['n'];

        let wx = wallCoord[0];
        let wy = wallCoord[1];
        //if wall needs perspective
        if((bitMap[wx][wy] && tileDict.ew.mask) === tileDict.ew.mask){
            mask = mask | pathDict.f;
        }
        return mask
    }



    for(let direction in directionDict){
        let tempMask;
        let neighborCoord = directionDict[direction];
        let wallCoord = walls[direction];
        //let northWallCoord = walls[direction];
        let nx = neighborCoord[0];
        let ny = neighborCoord[1];

        let wx = wallCoord[0];
        let wy = wallCoord[1];

        //let nwx = northWallCoord[0];
        //let nwy = northWallCoord[1];



        if ((wx < 0 || wx > width-1) || (wy < 0 || wy > height-1)){
            //mask = mask | pathDict[direction];
        } else{

            //let neighbor = visited[neighborCoord[0]][neighborCoord[1]];
            if (visited[wx][wy]){
                tempMask = pathDict[direction];
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
        n: [x   , y - 2  ],
        e: [x+2 , y      ],
        s: [x   , y + 2  ],
        w: [x-2 , y      ],
    };

    let walls = {
        n: [x,y - 1],
        //n2: [x,y - 2],
        e: [x+1,y],
        s: [x,y+1],
       //s2: [x,y+2],
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

        /*
        let wx2,wy2;
        if((dir === 'n') || (dir === 's')){
            wx2 = walls[dir+'2'][0];
            wy2 = walls[dir+'2'][1];
        }
        */

        if (visited[nx]){
            if (visited[nx][ny] === 0){ //if unvisited
                neighbor = [nx,ny];
                visited[wx][wy] = 1;

                /*
                if((dir === 'n') || (dir === 's')) {
                    visited[wx2][wy2] = 1;
                }
                */
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
            if (x === 0 || x === width || y === 0 || y === height){
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