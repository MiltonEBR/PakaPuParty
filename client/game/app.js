const world = new World();
let playerNumber, playerUsername;
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
    readyBtn = document.querySelector('#start-game'),
    menu = document.querySelector('#menu');

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

function disableLobby() {
    readyBtn.disabled = true;
    lobby.classList.add('fade-out');
    setTimeout(() => {
        lobby.innerHTML = '';
        lobby.style.display = 'none';
    }, 250);
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

    sock.on('colorChange', handleColorChange);

    sock.on('playerDisconnect', handleDisconnect);

    sock.on('updateNumber', (num) => {
        playerNumber = num;
    });

    async function handlePlayerSelect(data) {
        await disableMainMenu();

        const players = data.players,
            readyList = data.readyList;
        playerNumber = data.number;
        playerUsername = data.username;
        for (let i = 0; i < players.length; i++) {
            const player = players[i];
            const playerHolder = document.createElement('div');
            playerHolder.classList.add('player-holder');
            playerHolder.id = `holder-${player.username}`;
            if (playerUsername === player.username) {
                playerHolder.innerHTML = `
                <button id="select-left" class="select-arrow">
                    <i class="fas fa-chevron-left"></i>
                </button>
                <div class="player-icon" style="background-color:${player.color};"></div>
                <button id="select-right" class="select-arrow">
                    <i class="fas fa-chevron-right"></i>
                </button>
                <span class="player-txt">${player.username}</span>
                <i class="fas fa-check-square ready" ></i>`;
            } else {
                playerHolder.innerHTML = `
                <div class="player-icon" style="background-color:${player.color};"></div>
                <span class="player-txt">${player.username}</span>
                <i class="fas fa-check-square ready" ></i>`;
            }

            playerSelection.appendChild(playerHolder);
            playerSelection.appendChild(readyBtn);
            playerSelection.style.display = 'flex';

            if (readyList[i]) {
                handlePlayerReady(player.username);
            }
        }

        document
            .getElementById(`holder-${playerUsername}`)
            .querySelector('.player-txt').style.color = 'rgb(137, 129, 68)';

        readyBtn.addEventListener('click', () => {
            sock.emit('ready', { username: playerUsername, number: playerNumber });
        });

        const leftArrow = document.getElementById('select-left'),
            rightArrow = document.getElementById('select-right');
        leftArrow.addEventListener('click', () => {
            sock.emit('getColor', { playerNum: playerNumber, side: 'left' });
        });

        rightArrow.addEventListener('click', () => {
            sock.emit('getColor', { playerNum: playerNumber, side: 'right' });
        });
    }

    function handlePlayerJoined(player) {
        const playerHolder = document.createElement('div');
        playerHolder.classList.add('player-holder');
        playerHolder.id = `holder-${player.username}`;

        playerHolder.innerHTML = `
                <div class="player-icon" style="background-color:${player.color};"></div>
                <span class="player-txt">${player.username}</span>
                <i class="fas fa-check-square ready"></i>`;

        playerSelection.appendChild(playerHolder);
        playerSelection.appendChild(readyBtn);
    }

    function handlePlayerReady(username) {
        if (username === playerUsername) {
            readyBtn.disabled = true;
            readyBtn.innerText = 'Ready';
            const leftArrow = document.getElementById('select-left'),
                rightArrow = document.getElementById('select-right');
            rightArrow.disabled = true;
            rightArrow.style.display = 'none';
            leftArrow.disabled = true;
            leftArrow.style.display = 'none';
        } else {
            const text = document.getElementById(`holder-${username}`).querySelector('.player-txt');
            text.style.color = 'rgb(83, 163, 83)';
        }
        const check = document.getElementById(`holder-${username}`).querySelector('.ready');
        check.style.opacity = '1';
    }

    function handleColorChange(data) {
        const username = data.username;
        const color = data.color;
        document
            .getElementById(`holder-${username}`)
            .querySelector('.player-icon').style.backgroundColor = color;
    }

    function handleDisconnect(removed) {
        const removedName = removed.removedName,
            id = removed.id;

        const playerToRemove = document.getElementById(`holder-${removedName}`);
        playerToRemove.parentNode.removeChild(playerToRemove);
        const leftArrow = document.getElementById('select-left'),
            rightArrow = document.getElementById('select-right');

        if (leftArrow && rightArrow) {
            readyBtn.disabled = false;
            readyBtn.innerText = 'Not Ready';

            rightArrow.disabled = false;
            rightArrow.style.removeProperty('display');
            leftArrow.disabled = false;
            leftArrow.style.removeProperty('display');

            const playerHolders = playerSelection.querySelectorAll('.player-holder');
            for (holder of playerHolders) {
                const check = holder.querySelector('.ready');
                check.style.opacity = '0';
                if (holder.id !== `holder-${playerUsername}`) {
                    const text = holder.querySelector('.player-txt');
                    text.style.color = 'black';
                }
            }
        } else {
            world.deleteEntity(id);
            popUpMsg(`${removedName} left the game`);
        }
    }
}

function popUpMsg(msg) {
    const popUp = document.createElement('div');
    popUp.classList.add('pop-up');
    popUp.innerText = msg;
    menu.insertBefore(popUp, menu.querySelector('#items-holder'));
    const time = 4000;
    setTimeout(() => {
        popUp.style.opacity = '0';
    }, time - 1000);
    setTimeout(() => {
        popUp.parentNode.removeChild(popUp);
    }, time);
}

function addPlayerScoreBoard(name, points, color) {
    const playerHolder = document.createElement('div');
    playerHolder.classList.add('player-holder');
    playerHolder.id = `holder-${name}`;
    const playerIcon = document.createElement('div');
    playerIcon.classList.add('player-icon');
    playerIcon.style.backgroundColor = color;
    const playerText = document.createElement('div');
    playerText.classList.add('player-txt');
    playerText.id = 'player-name-' + name;
    playerText.innerText = name;
    if (name === playerUsername) playerText.style.color = 'rgb(137, 129, 68)';
    const playerPoints = document.createElement('div');
    playerPoints.classList.add('player-points');
    playerPoints.id = 'player-score-' + name;
    playerPoints.innerText = points + ' p.';

    playerHolder.appendChild(playerIcon);
    playerHolder.appendChild(playerText);
    playerHolder.appendChild(playerPoints);

    scoreBoard.appendChild(playerHolder);
}

const dice = document.getElementById('dice');

function initItemButtons() {
    dice.addEventListener('click', () => {
        sock.emit('rollDice', { username: playerUsername, number: playerNumber });
    });

    disableItems();
}

function disableItems() {
    dice.disabled = true;
}

function enableItems() {
    dice.disabled = false;
}

function initGame() {
    initItemButtons();

    sock.on('init', (data) => {
        handleInit(data);
        disableLobby();
    });
    // sock.on('update', update);

    sock.on('playerTurn', (username) => {
        const turnHolder = scoreBoard.querySelector(`#holder-${username}`);
        turnHolder.classList.add('current-turn');

        if (username === playerUsername) {
            enableItems();
        }
    });

    const gameCanvas = document.querySelector('canvas');

    const renderer = new Renderer(world.entities, gameCanvas, {
        wireframes: true,
    });
    renderer.run();

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
                addPlayerScoreBoard(
                    newPlayer.username,
                    newPlayer.points,
                    newPlayer.render.strokeStyle
                );
            } //Else throw an error?
        }
    }

    function update(dataList) {
        for (let data of dataList) {
            const { id, position, vertices } = data;
            world.updateEntity(id, { position, vertices });
        }
    }
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
