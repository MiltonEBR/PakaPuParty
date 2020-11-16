//const sock=io();

const Engine = Matter.Engine,
    Mouse = Matter.Mouse,
    MouseConstraint = Matter.MouseConstraint,
    World = Matter.World,
    Bodies = Matter.Bodies,
    Render = Matter.Render,
    Body = Matter.Body;

function initGame() {
    const gameCanvas = document.querySelector('canvas');
    const engine = Engine.create();
    const renderer = new Renderer(engine.world, gameCanvas, {
        wireframes: true,
    });
    const objects = new WorldObjects();

    const player = objects.createPlayer(200, 200);
    const tile = objects.createTile(400, 200);

    const mouse = Mouse.create(gameCanvas);
    const mouseConstraint = MouseConstraint.create(engine, {
        mouse: mouse,
    });
    World.add(engine.world, [tile, player, mouseConstraint]);

    renderer.run();
    engine.world.gravity.y = 0;
    Engine.run(engine);
}

initGame();
