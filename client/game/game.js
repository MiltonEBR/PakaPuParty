//const sock=io();

const Engine = Matter.Engine,
    Vector = Matter.Vector,
    Mouse = Matter.Mouse,
    MouseConstraint = Matter.MouseConstraint,
    World = Matter.World,
    Bodies = Matter.Bodies,
    Events = Matter.Events,
    Body = Matter.Body;

function initGame() {
    const gameCanvas = document.querySelector('canvas');
    const engine = Engine.create();
    const renderer = new Renderer(engine.world, gameCanvas, {
        wireframes: true,
    });
    const objects = new WorldObjects();

    const tiles = [
        objects.createTile(400, 200, 'left'),
        objects.createTile(500, 200, 'sides'),
        objects.createTile(600, 200, 'sides'),
        objects.createTile(700, 200, 'sides'),
        objects.createTile(800, 200, 'right-down'),
        objects.createTile(800, 300, 'right-up'),
        objects.createTile(700, 300, 'sides'),
        objects.createTile(600, 300, 'sides'),
        objects.createTile(500, 300, 'left-down'),
        objects.createTile(500, 400, 'up'),
        objects.createTile(500, 500, 'left-up'),
        objects.createTile(600, 500, 'sides'),
        objects.createTile(700, 500, 'sides'),
        objects.createTile(800, 500, 'right'),
    ];
    const player = objects.createPlayer(tiles[0]);
    const mouse = Mouse.create(gameCanvas);
    const mouseConstraint = MouseConstraint.create(engine, {
        mouse: mouse,
        collisionFilter: { mask: objects.filterList.interactable },
    });

    document.body.addEventListener('keydown', (e) => {
        player.game.setSpeed(1, 2);
    });
    Events.on(engine, 'collisionStart', (e) => {
        console.log(e.pairs[0].bodyA);
        if (e.pairs[0].bodyB.label === 'player' && e.pairs[0].bodyA.label === 'tile') {
            player.game.stop();
        }
    });

    World.add(engine.world, [...tiles, player, mouseConstraint]);

    renderer.run();
    engine.world.gravity.y = 0;
    Engine.run(engine);
}

initGame();
