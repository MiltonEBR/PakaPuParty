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

    const gameBoard = objects.createMap('debug');
    console.log(gameBoard);
    const player = objects.createPlayer(gameBoard[0]);
    const mouse = Mouse.create(gameCanvas);
    const mouseConstraint = MouseConstraint.create(engine, {
        mouse: mouse,
        collisionFilter: { mask: objects.filterList.interactable },
    });

    document.body.addEventListener('keydown', (e) => {
        if (e.key === 'a') {
            //player.game.moveTo(tiles[1]);
        } else if (e.key === 's') {
            player.game.setSpeed(0, 2);
        }
    });
    Events.on(engine, 'collisionStart', (e) => {
        const a = e.pairs[0].bodyA;
        const b = e.pairs[0].bodyB;
        console.log(b);
        if (b.label === 'player' && a.label === 'tile') {
            player.game.stop();
        }
    });

    World.add(engine.world, [...gameBoard, player, mouseConstraint]);

    renderer.run();
    engine.world.gravity.y = 0;
    Engine.run(engine);
}

initGame();
