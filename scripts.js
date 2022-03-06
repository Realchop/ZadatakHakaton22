const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d");
let animating = false;
let latest_render_depth = 0;

canvas.width = 2000;
canvas.height = 1732;

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
    let base = new Triangle();
    ctx.fillStyle = "red";
    base.draw();
    ctx.fillStyle = "white";
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

function main(depth){
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
    canvas.width = value;
    canvas.height = value*0.866;
    main(latest_render_depth);
}

main(8);