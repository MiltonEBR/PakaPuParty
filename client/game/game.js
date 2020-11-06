//const sock=io();

const Engine = Matter.Engine,
    //Render = Matter.Render,
    World = Matter.World,
    Bodies = Matter.Bodies;

const engine = Engine.create();

const gameCanvas=document.querySelector('canvas');


const box=Bodies.rectangle(100,100,50,50);

const base=Bodies.rectangle(100,400,200,50,{isStatic:true});

box.draw=(ctx)=>{
  //ctx.fillRect(box.position.x,box.position.y);
  ctx.beginPath();
  ctx.moveTo(box.vertices[0].x,box.vertices[0].y);

  for (var j = 1; j < box.vertices.length; j += 1) {
    ctx.lineTo(box.vertices[j].x, box.vertices[j].y);
  }
  ctx.closePath();
  //ctx.lineTo(box.vertices[0].x,box.vertices[0].y);

  ctx.lineWidth = 1;
  ctx.strokeStyle = '#000';
  ctx.stroke();
}

base.draw=(ctx)=>{
  //ctx.fillRect(box.position.x,box.position.y);
  ctx.beginPath();
  ctx.moveTo(base.vertices[0].x,base.vertices[0].y);

  for (var j = 1; j < base.vertices.length; j += 1) {
    ctx.lineTo(base.vertices[j].x, base.vertices[j].y);
  }
  ctx.closePath();
  //ctx.lineTo(box.vertices[0].x,box.vertices[0].y);

  ctx.lineWidth = 1;
  ctx.strokeStyle = 'blue';
  ctx.stroke();
}

World.add(engine.world,[box,base]);

const renderer=new Renderer(engine.world,gameCanvas);
renderer.run();

Engine.run(engine);
