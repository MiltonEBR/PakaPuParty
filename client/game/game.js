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
    const tiles = [
        objects.createTile(400, 200, 'up'),
        objects.createTile(500, 200, 'side'),
        objects.createTile(600, 200, 'null'),
    ];
    const mouse = Mouse.create(gameCanvas);
    const mouseConstraint = MouseConstraint.create(engine, {
        mouse: mouse,
        collisionFilter: { mask: objects.filterList.interactable },
    });
    World.add(engine.world, [...tiles, player, mouseConstraint]);

    renderer.run();
    engine.world.gravity.y = 0;
    Engine.run(engine);
}

initGame();
