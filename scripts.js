const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d");
let primaryColor = "red";
let secondaryColor = "white";
let latest_render_depth = 8;

let canvasWidth = 2000;
let canvasHeight = 1732;

class Point{
    constructor(x,y){
        this.x = x;
        this.y = y;
    }
}

class Triangle{
    constructor(points=null){
        if(points==null){
            let point1 = new Point(canvas.width/2,0);
            let point2 = new Point(0,canvas.height);
            let point3 = new Point(canvas.width,canvas.height);
            this.points = [point1,point2,point3];
        }
        else this.points = points;
    }
    draw(){
        ctx.beginPath();
        ctx.moveTo(this.points[0].x,this.points[0].y);
        ctx.lineTo(this.points[1].x,this.points[1].y);
        ctx.lineTo(this.points[2].x,this.points[2].y);
        ctx.lineTo(this.points[0].x,this.points[0].y);
        ctx.fill();
    }
}

function init(){
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    ctx.fillStyle = secondaryColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    let base = new Triangle();
    ctx.fillStyle = primaryColor;
    base.draw();
    ctx.fillStyle = secondaryColor;
    return base;
}

function makeHole(tri){
    let holePoints = []
    for(let i=0;i<3;++i){
        holePoints.push(new Point(
            (tri.points[i].x+tri.points[(i+1)%3].x)/2,
            (tri.points[i].y+tri.points[(i+1)%3].y)/2
            )
            );
    }
    let hole = new Triangle(holePoints);
    hole.draw();
    let newTri1 = new Triangle(
        [tri.points[0],
        holePoints[0],
        holePoints[2]]
    )
    let newTri2 = new Triangle(
        [tri.points[1],
        holePoints[1],
        holePoints[0]]
    )
    let newTri3 = new Triangle(
        [tri.points[2],
        holePoints[2],
        holePoints[1]]
    )
    return [newTri1,newTri2,newTri3];
}

function main(depth=null){
    if(depth==null) depth = latest_render_depth;
    let q = [init()];
    for(let d=0;d<depth;++d){
        let current = q.length;
        for(let i=0;i<current;++i){
            let tris = makeHole(q[i]);
            const tri1 = tris[0];
            const tri2 = tris[1];
            const tri3 = tris[2];
            q.push(tri1);
            q.push(tri2);
            q.push(tri3);
        }
        q.splice(0,current);
    }
    latest_render_depth = depth;
}

function changeResolution(value){
    canvasWidth = value;
    canvasHeight = value*0.866;
}

function changeDepth(value){
    latest_render_depth = value;
}

function download(){
    let dl_link = document.getElementById("download_link");
    dl_link.setAttribute("href", canvas.toDataURL('image/png'));
    dl_link.click();
}

function changePrimary(value){
    primaryColor = value;
}

function changeBackground(value){
    secondaryColor = value;
}

main(latest_render_depth);