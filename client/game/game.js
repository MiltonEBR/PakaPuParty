//const sock=io();

const Engine = Matter.Engine,
    //Render = Matter.Render,
    World = Matter.World,
    Bodies = Matter.Bodies;

function initGame() {
    const gameCanvas = document.querySelector("canvas");
    const engine = Engine.create();
    const renderer = new Renderer(engine.world, gameCanvas, {
        wireframes: true,
    });

    //Dummy items on the world
    const box = Bodies.rectangle(100, 100, 50, 50);
    box.render.lineWidth = 4;
    const base = Bodies.rectangle(100, 400, 200, 50, { isStatic: true });

    World.add(engine.world, [box, base]);

    renderer.run();

    Engine.run(engine);
}

initGame();
