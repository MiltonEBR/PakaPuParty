const sock = io();

function initLobby() {
    const username = document.querySelector('#username'),
        room = document.querySelector('#room'),
        createBtn = document.querySelector('#create'),
        joinBtn = document.querySelector('#join'),
        lobby = document.querySelector('#lobby'),
        gameHolder = document.querySelector('.game-holder'),
        codeDisplay = document.querySelector('#room-name'),
        errMsg = document.querySelector('#err-msg');

    username.value = '';
    room.value = '';

    createBtn.addEventListener('click', (e) => {
        e.preventDefault();
        sock.emit('createGame', username.value);
    });

    joinBtn.addEventListener('click', (e) => {
        e.preventDefault();
        sock.emit('joinGame', { username: username.value, room: room.value });
    });

    sock.on('gameCode', (code) => {
        codeDisplay.innerHTML = 'Room name: ' + code;
        username.disabled = true;
        room.disabled = true;
        joinBtn.disabled = true;
        createBtn.disabled = true;
        lobby.classList.add('fade-out');
        setTimeout(() => {
            lobby.innerHTML = '';
            lobby.style.display = 'none';
        }, 250);
    });

    sock.on('unknownGame', () => {
        errMsg.innerHTML = 'That game does not exist';
        errMsg.style.display = 'inline';
    });

    sock.on('gameFull', () => {
        errMsg.innerHTML = 'The game is full';
        errMsg.style.display = 'inline';
    });
}

initLobby();
