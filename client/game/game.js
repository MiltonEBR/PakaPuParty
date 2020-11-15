//const sock=io();

const Engine = Matter.Engine,
    //Render = Matter.Render,
    World = Matter.World,
    Bodies = Matter.Bodies;

function initGame() {
    const gameCanvas = document.querySelector('canvas');
    const engine = Engine.create();
    const renderer = new Renderer(engine.world, gameCanvas, {
        wireframes: true,
    });
    const objects = new WorldObjects();

    const player = objects.createPlayer(200, 200);
    const tile = objects.createTile(400, 200);
    World.add(engine.world, [player, tile]);

    renderer.run();
    engine.world.gravity.y = 0;
    Engine.run(engine);

    const clickEvent = (e) => {
        console.log(e);
    };

    let mouse = Matter.Mouse.create(gameCanvas);
    let mouseConstraint = Matter.MouseConstraint.create(engine, {
        mouse: mouse,
    });

    Matter.World.add(engine.world, mouseConstraint);
}

initGame();
