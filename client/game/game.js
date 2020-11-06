//const sock=io();

const Engine = Matter.Engine,
    Render = Matter.Render,
    World = Matter.World,
    Bodies = Matter.Bodies;

const engine = Engine.create();

const gameCanvas=document.querySelector('canvas');

const render = Render.create({
    canvas: gameCanvas,
    engine: engine,
    options: {
      width: gameCanvas.width,
      height: gameCanvas.height,
      background: 'black',
      wireframes: false,
      showAngleIndicator: false
    }
  });

const box=Bodies.rectangle(100,100,50,50,{
    render: {
        fillStyle: 'red',
        strokeStyle: 'blue',
        lineWidth: 3
   }
});

World.add(engine.world,box);

Engine.run(engine);

Render.run(render);