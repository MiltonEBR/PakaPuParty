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

    const gameBoard = objects.createBoard('debug', { x: 100, y: 300 });
    let cont = 0;
    const player = objects.createPlayer(gameBoard[cont]);
    const dirArrows = objects.createArrowManager(player.game.currentTile);

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
        let playerColl;
        let tileColl;
        if (a.label === 'player') {
            playerColl = a;
        } else if (b.label === 'player') {
            playerColl = b;
        }
        if (b.label === 'tile') {
            tileColl = b;
        } else if (a.label === 'tile') {
            tileColl = a;
        }
        // console.log(playerColl);
        // console.log(tileColl);
        if (playerColl && tileColl) {
            if (playerColl.game.targetTile === tileColl) {
                playerColl.game.stop();
                dirArrows.setToTile(playerColl.game.currentTile);
            }
            //player.game.currentTile = a;
            //player.game.stop();
        }
    });

    Events.on(mouseConstraint, 'mousedown', (e) => {
        const clicked = mouseConstraint.body;
        if (!clicked) {
            return;
        }
        if (clicked.label === 'dirArrow') {
            if (clicked.target) {
                player.game.moveTo(clicked.target);
            }
        }
    });
    World.add(engine.world, [...gameBoard, player, ...dirArrows.getArrowList(), mouseConstraint]);
    renderer.run();
    engine.world.gravity.y = 0;
    Engine.run(engine);
}

initGame();
