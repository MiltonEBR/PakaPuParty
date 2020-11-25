const sock = io();

function initLobby() {
    const username = document.querySelector('#username'),
        room = document.querySelector('#room'),
        createBtn = document.querySelector('#create'),
        joinBtn = document.querySelector('#join'),
        lobby = document.querySelector('#lobby'),
        gameHolder = document.querySelector('.game-holder');

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

    sock.on('startGame', () => {
        username.disabled = true;
        room.disabled = true;
        joinBtn.disabled = true;
        createBtn.disabled = true;
        lobby.classList.add('fade-out');
        setTimeout(() => {
            lobby.innerHTML = '';
            lobby.style.display = 'none';
        }, 250);
        // const canvas = document.createElement('canvas');
        // canvas.width = 1470;
        // canvas.height = 750;
        // canvas.id = 'game';
        // gameHolder.appendChild(canvas);
    });
}

initLobby();
