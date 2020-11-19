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
    const dirArrows = objects.createDirectionArrows(500, 300);
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
        let playerColl;
        if (a.label === 'player') playerColl = a;
        if (b.label === 'player') playerColl = b;

        if (b.label === 'player' && a.label === 'tile') {
            player.game.currentTile = a;
            player.game.stop();
        }
    });

    Events.on(mouseConstraint, 'mousedown', (e) => {
        if (!mouseConstraint.body) {
            return;
        }
        if (mouseConstraint.body.label === 'dirArrow') {
            console.log(mouseConstraint.body);
            if (mouseConstraint.body.enabled) {
                console.log('canclick');
            } else {
                console.log('cantclick');
            }
        }
    });
    World.add(engine.world, [
        ...gameBoard,
        player,
        ...Object.values(dirArrows.arrows),
        mouseConstraint,
    ]);
    dirArrows.changePos({ x: 200, y: 500 });

    renderer.run();
    engine.world.gravity.y = 0;
    Engine.run(engine);

    //Debug
    console.log(gameBoard);
    dirArrows.setEnabled('top', false);
}

initGame();
