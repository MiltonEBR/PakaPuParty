const world = new World();
let playerNumber;
let playerUsername;
const sock = io();

const username = document.querySelector('#username'),
    room = document.querySelector('#room'),
    createBtn = document.querySelector('#create'),
    joinBtn = document.querySelector('#join'),
    lobby = document.querySelector('#lobby'),
    codeDisplay = document.querySelector('#room-name'),
    errMsg = document.querySelector('#err-msg'),
    scoreBoard = document.querySelector('#scoreboard'),
    form = document.querySelector('#lobby-form'),
    playerSelection = document.querySelector('#player-selection'),
    readyBtn = document.querySelector('#start-game');

async function disableMainMenu() {
    username.disabled = true;
    room.disabled = true;
    joinBtn.disabled = true;
    createBtn.disabled = true;
    form.classList.add('fade-out');
    await new Promise((res) => {
        setTimeout(() => {
            form.innerHTML = '';
            form.style.display = 'none';
            res();
        }, 250);
    });
}

function initMainMenu() {
    username.value = '';
    room.value = '';

    const checkUsername = (name) => {
        if (name === '') {
            displayError('Please enter a name');
            return false;
        } else if (name.length > 10) {
            displayError('Name must be between 1 and 10 characters');
            return false;
        } else if (name.includes('-') || name.includes('<') || name.includes('>')) {
            displayError(`Name can't include "-, <, >"`);
            return false;
        }

        return true;
    };

    createBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (!checkUsername(username.value)) return;
        sock.emit('createGame', { username: username.value });
    });
    joinBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (!checkUsername(username.value)) return;
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

function initPlayerSelect() {
    sock.on('playerSelection', handlePlayerSelect);

    sock.on('playerJoined', handlePlayerJoined);

    sock.on('playerReady', handlePlayerReady);

    async function handlePlayerSelect(data) {
        await disableMainMenu();

        const players = data.players;
        playerNumber = data.number;
        playerUsername = data.username;
        for (player of players) {
            const playerHolder = document.createElement('div');
            playerHolder.classList.add('player-holder');
            playerHolder.id = `holder-${player.username}`;

            if (playerUsername === player.username) {
                playerHolder.innerHTML = `
                <button id="select-left" class="select-arrow">
                    <i class="fas fa-chevron-left"></i>
                </button>
                <div class="player-icon"></div>
                <button id="select-right" class="select-arrow">
                    <i class="fas fa-chevron-right"></i>
                </button>
                <span class="player-txt">${player.username}</span>
                <i class="fas fa-check-square ready" ></i>`;
            } else {
                playerHolder.innerHTML = `
                <div class="player-icon"></div>
                <span class="player-txt">${player.username}</span>
                <i class="fas fa-check-square ready" ></i>`;
            }

            playerSelection.appendChild(playerHolder);
            playerSelection.appendChild(readyBtn);
            playerSelection.style.display = 'flex';
        }

        readyBtn.addEventListener('click', () => {
            sock.emit('ready', { username: playerUsername, number: playerNumber });
        });
    }

    function handlePlayerJoined(player) {
        const playerHolder = document.createElement('div');
        playerHolder.classList.add('player-holder');

        playerHolder.innerHTML = `
                <div id="icon-player-${player.username}" class="player-icon"></div>
                <span id="text-player-${player.username}" class="player-txt">${player.username}</span>
                <i class="fas fa-check-square ready" style="display: none;"></i>`;

        playerSelection.appendChild(playerHolder);
        playerSelection.appendChild(readyBtn);
    }

    function handlePlayerReady(username) {
        if (username === playerUsername) {
            readyBtn.disabled = true;
            readyBtn.innerText = 'Ready';
        }
        const check = document.getElementById(`holder-${username}`).querySelector('.ready');
        check.style.opacity = '1';
    }
}

function addPlayerScoreBoard(name, points, color) {
    const playerHolder = document.createElement('div');
    playerHolder.classList.add('player-holder');
    const playerIcon = document.createElement('div');
    playerIcon.classList.add('player-icon');
    playerIcon.style.backgroundColor = color;
    const playerText = document.createElement('div');
    playerText.classList.add('player-txt');
    playerText.id = 'player-name-' + name;
    playerText.innerText = name;
    const playerPoints = document.createElement('div');
    playerPoints.classList.add('player-points');
    playerPoints.id = 'player-score-' + name;
    playerPoints.innerText = points + ' p.';

    playerHolder.appendChild(playerIcon);
    playerHolder.appendChild(playerText);
    playerHolder.appendChild(playerPoints);

    scoreBoard.appendChild(playerHolder);
}

function handleInit(dataObj) {
    const tiles = dataObj.tiles,
        players = dataObj.players;
    for (let tile of tiles) {
        if (world.verifyData(tile)) {
            world.createTile(tile);
        } //Else throw an error?
    }
    for (let player of players) {
        if (world.verifyData(player)) {
            const newPlayer = world.createPlayer(player);
            addPlayerScoreBoard(newPlayer.username, newPlayer.points, newPlayer.render.strokeStyle);
        } //Else throw an error?
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

    // sock.on('playerJoined', (playerData) => {
    //     const joinedPlayer = world.createPlayer(playerData);
    //     addPlayerScoreBoard(
    //         joinedPlayer.username,
    //         joinedPlayer.points,
    //         joinedPlayer.render.strokeStyle
    //     );
    // });

    const gameCanvas = document.querySelector('canvas');

    const renderer = new Renderer(world.entities, gameCanvas, {
        wireframes: true,
    });
    renderer.run();
}

initMainMenu();
initPlayerSelect();
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
