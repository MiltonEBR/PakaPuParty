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
        objects.createTile(500, 200, 'sides'),
        objects.createTile(600, 200, 'null'),
        objects.createTile(700, 200, 'left'),
        objects.createTile(400, 300, 'right'),
        objects.createTile(500, 300, 'right-down'),
        objects.createTile(600, 300, 'right-up'),
        objects.createTile(700, 300, 'left-up'),
        objects.createTile(800, 300, 'left-down'),
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
