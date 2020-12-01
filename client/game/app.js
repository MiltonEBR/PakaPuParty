const world = new World();
let playerNumber;
const sock = io();

const username = document.querySelector('#username'),
    room = document.querySelector('#room'),
    createBtn = document.querySelector('#create'),
    joinBtn = document.querySelector('#join'),
    lobby = document.querySelector('#lobby'),
    codeDisplay = document.querySelector('#room-name'),
    errMsg = document.querySelector('#err-msg'),
    scoreBoard = document.querySelector('#scoreboard');

function disableMainMenu() {
    username.disabled = true;
    room.disabled = true;
    joinBtn.disabled = true;
    createBtn.disabled = true;
    lobby.classList.add('fade-out');
    setTimeout(() => {
        lobby.innerHTML = '';
        lobby.style.display = 'none';
    }, 250);
}

function initMainMenu() {
    username.value = '';
    room.value = '';

    createBtn.addEventListener('click', (e) => {
        e.preventDefault();
        sock.emit('createGame', { username: username.value });
    });
    joinBtn.addEventListener('click', (e) => {
        e.preventDefault();
        sock.emit('joinGame', { username: username.value, room: room.value });
    });

    sock.on('gameCode', setRoomNumber);

    sock.on('err', (msg) => {
        displayError(msg);
    });

    function setRoomNumber(code) {
        codeDisplay.innerHTML = 'Room name: ' + code;
    }

    function displayError(err) {
        errMsg.innerHTML = err;
        errMsg.style.display = 'inline';
    }
}

function addPlayerScoreBoard(name, color) {
    const playerHolder = document.createElement('div');
    playerHolder.classList.add('player-holder');
    const playerIcon = document.createElement('div');
    playerIcon.classList.add('player-icon');
    playerIcon.style.backgroundColor = color;
    const playerText = document.createElement('div');
    playerText.classList.add('player-txt');
    playerText.id = 'player-name-' + name;
    playerText.innerText = name;

    playerHolder.appendChild(playerIcon);
    playerHolder.appendChild(playerText);

    scoreBoard.appendChild(playerHolder);
}

function handleInit(dataObj) {
    const tiles = dataObj.tiles,
        players = dataObj.players,
        number = dataObj.playerNumber;
    for (let tile of tiles) {
        if (world.verifyData(tile)) {
            world.createTile(tile);
        } //Else throw an error?
    }
    for (let player of players) {
        if (world.verifyData(player)) {
            const newPlayer = world.createPlayer(player);
            addPlayerScoreBoard(player.username, newPlayer.render.strokeStyle);
        } //Else throw an error?
    }

    if (number) {
        playerNumber = number;
    }
}

function update(dataList) {
    for (let data of dataList) {
        const { id, position, vertices } = data;
        world.updateEntity(id, { position, vertices });
    }
}

function initGame() {
    sock.on('init', (data) => {
        handleInit(data);
        disableMainMenu();
    });
    sock.on('update', update);

    sock.on('playerJoined', (playerData) => {
        const joinedPlayer = world.createPlayer(playerData);
        addPlayerScoreBoard(playerData.username, joinedPlayer.render.strokeStyle);
    });

    const gameCanvas = document.querySelector('canvas');

    const renderer = new Renderer(world.entities, gameCanvas, {
        wireframes: true,
    });
    renderer.run();
}

initMainMenu();
initGame();

// function initGame() {
//     const sock = io();
//     sock.on('init', handleInit);
//     const gameCanvas = document.querySelector('canvas');
//     const engine = Engine.create();

//     const objects = new WorldObjects();

//     const gameBoard = objects.createBoard('debug', { x: 100, y: 300 });
//     let cont = 0;
//     const player = objects.createPlayer(gameBoard[cont]);
//     const dirArrows = objects.createArrowManager(player.game.currentTile);
//     const mouse = Mouse.create(gameCanvas);
//     const mouseConstraint = MouseConstraint.create(engine, {
//         mouse: mouse,
//         collisionFilter: { mask: objects.filterList.interactable },
//     });
//     document.body.addEventListener('keydown', (e) => {
//         if (e.key === 'a') {
//             player.game.moveTo(gameBoard[cont]);
//             cont += 1;
//         } else if (e.key === 's') {
//             player.game.setSpeed(0, 2);
//         }
//     });
//     Events.on(engine, 'collisionStart', (e) => {
//         const a = e.pairs[0].bodyA;
//         const b = e.pairs[0].bodyB;
//         let playerColl;
//         let tileColl;
//         if (a.label === 'player') {
//             playerColl = a;
//         } else if (b.label === 'player') {
//             playerColl = b;
//         }
//         if (b.label === 'tile') {
//             tileColl = b;
//         } else if (a.label === 'tile') {
//             tileColl = a;
//         }
//         if (playerColl && tileColl) {
//             if (playerColl.game.targetTile === tileColl) {
//                 playerColl.game.stop();
//                 dirArrows.setToTile(playerColl.game.currentTile);
//             }
//         }
//     });

//     Events.on(mouseConstraint, 'mousedown', (e) => {
//         const clicked = mouseConstraint.body;
//         if (!clicked) {
//             return;
//         }
//         if (clicked.label === 'dirArrow') {
//             if (clicked.target) {
//                 player.game.moveTo(clicked.target);
//                 dirArrows.deactivate();
//             }
//         }
//     });
//     World.add(engine.world, [...gameBoard, player, ...dirArrows.getArrowList(), mouseConstraint]);
//     const renderer = new Renderer(engine.world, gameCanvas, {
//         wireframes: true,
//     });
//     renderer.run();
//     engine.world.gravity.y = 0;
//     Engine.run(engine);
// }