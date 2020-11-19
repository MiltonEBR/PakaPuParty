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

    const gameBoard = objects.createMap('debug', { x: 100, y: 300 });
    let cont = 0;
    const player = objects.createPlayer(gameBoard[cont]);
    const mouse = Mouse.create(gameCanvas);
    const mouseConstraint = MouseConstraint.create(engine, {
        mouse: mouse,
        collisionFilter: { mask: objects.filterList.interactable },
    });

    document.body.addEventListener('keydown', (e) => {
        if (e.key === 'a') {
            player.game.moveTo(gameBoard[cont]);
            cont += 1;
        } else if (e.key === 's') {
            player.game.setSpeed(0, 2);
        }
    });
    Events.on(engine, 'collisionStart', (e) => {
        const a = e.pairs[0].bodyA;
        const b = e.pairs[0].bodyB;
        if (b.label === 'player' && a.label === 'tile') {
            player.game.currentTile = a;
            player.game.stop();
        }
    });

    World.add(engine.world, [...gameBoard, player, mouseConstraint]);

    renderer.run();
    engine.world.gravity.y = 0;
    Engine.run(engine);
    console.log(gameBoard);
}

initGame();
