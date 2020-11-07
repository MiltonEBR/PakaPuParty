//const sock=io();

const Engine = Matter.Engine,
    //Render = Matter.Render,
    World = Matter.World,
    Bodies = Matter.Bodies;

const engine = Engine.create();

const gameCanvas=document.querySelector('canvas');


const box=Bodies.rectangle(100,100,50,50);
box.render.lineWidth=4;

const base=Bodies.rectangle(100,400,200,50,{isStatic:true});
console.log(box.render);
World.add(engine.world,[box,base]);

const renderer=new Renderer(engine.world,gameCanvas,{wireframes:true});
renderer.run();

Engine.run(engine);
