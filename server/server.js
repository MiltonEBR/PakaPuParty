const express = require('express');
const bodyParser = require('body-parser');
const socketio = require('socket.io');
const Game = require('./game/game');
const app = express();

app.use('/public', express.static(`${__dirname}/../client`));

app.get('/', (req, res) => {
    res.sendFile('index.html', { root: `../client` });
});

const server = app.listen(3000, () => {
    console.log('listening');
});

const io = socketio(server);

const games = {};
const clientRooms = {};
const clientPlayerNumber = {};

io.on('connection', (client) => {
    console.log('someone conected');

    client.on('createGame', handleCreateGame);
    client.on('joinGame', handleJoinGame);
    client.on('ready', (player) => {
        const roomName = clientRooms[client.id];
        if (games[roomName].playerList.length <= 1) return;
        games[roomName].readyList[parseInt(player.number) - 1] = true;
        io.sockets.in(roomName).emit('playerReady', player.username);
    });
    client.on('nextColor', (data) => {
        handleColorChange(data, 1);
    });
    client.on('backColor', (data) => {
        handleColorChange(data, -1);
    });

    client.on('disconnecting', () => {
        const roomName = clientRooms[client.id];
        if (!roomName) return;

        delete clientRooms[client.id];
        const numberLeft = parseInt(clientPlayerNumber[client.id]);
        delete clientPlayerNumber[client.id];
        const removedName = games[roomName].removePlayer(numberLeft - 1);
        let serializedData = {};
        for (let i = 0; i < games[roomName].playerList.length; i++) {
            const player = games[roomName].playerList[i];
            serializedData[player.username] = i + 1;
        }
        serializedData.removed = removedName;
        io.sockets.in(roomName).emit('playerDisconnect', serializedData);
    });

    function handleCreateGame(msg) {
        const username = msg.username;
        if (!verifyUsername(username)) {
            return;
        }
        let roomName = makeId(5);
        clientRooms[client.id] = roomName;
        games[roomName] = new Game();

        client.emit('gameCode', roomName);

        client.join(roomName);

        let playerNumber = games[roomName].createPlayer(username);
        clientPlayerNumber[client.id] = playerNumber;
        // let serializedData = games[roomName].serializeAll();
        let serializedData = games[roomName].playerList.map((player) => {
            return player.serializeAll();
        });

        client.emit('playerSelection', {
            players: serializedData,
            number: playerNumber,
            username,
            readyList: games[roomName].readyList,
        });
        // client.emit('init', serializedData);
    }

    function handleJoinGame(msg) {
        const username = msg.username,
            roomName = msg.room;

        const room = io.sockets.adapter.rooms[roomName];

        let allUsers;
        if (room) {
            allUsers = room.sockets;
        }

        let numClients = 0;
        if (allUsers) {
            numClients = Object.keys(allUsers).length;
        }

        if (numClients === 0) {
            client.emit('err', 'The game does not exist');
            return;
        } else if (numClients >= 8 || games[roomName].playerList.length >= 8) {
            //Second conditional it's because exiting the browser currently leaves your player "online"
            client.emit('err', 'The game is full');
            return;
        } else if (games[roomName].inProgress) {
            client.emit('err', 'Game in progress');
            return;
        } else if (!verifyUsername(username)) {
            return;
        } else if (!games[roomName].availableUsername(username)) {
            client.emit('err', 'Username in use');
            return;
        }
        clientRooms[client.id] = roomName;
        let playerNumber = games[roomName].createPlayer(username);
        clientPlayerNumber[client.id] = playerNumber;
        let serializedData = games[roomName].playerList.map((player) => {
            return player.serializeAll();
        });
        // let serializedData = games[roomName].serializeAll();

        io.sockets
            .in(roomName)
            .emit('playerJoined', games[roomName].playerList[playerNumber - 1].serializeAll());

        client.emit('gameCode', roomName);
        client.join(roomName);
        client.emit('playerSelection', {
            players: serializedData,
            number: playerNumber,
            username,
            readyList: games[roomName].readyList,
        });
        // client.emit('init', serializedData);

        // if (numClients === 1) {
        //     startInverval(roomName);
        // }
    }

    function startInverval(room) {
        const invervalId = setInterval(function () {
            let updateData = games[room].serialize();
            emitUpdate(room, updateData);
        }, 20);
    }

    function emitUpdate(roomName, updateData) {
        io.sockets.in(roomName).emit('update', updateData);
    }

    function makeId(length) {
        var result = '';
        var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for (var i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }

    function verifyUsername(name) {
        if (
            name === '' ||
            name.length > 10 ||
            name.includes('-') ||
            name.includes('<') ||
            name.includes('>')
        ) {
            client.emit('err', 'Invalid username');
            return false;
        }
        return true;
    }

    function handleColorChange(playerId, side) {
        const roomName = clientRooms[client.id];
        const targetPlayer = games[roomName].playerList[parseInt(playerId) - 1];
        let newColor;
        if (side === 1) {
            newColor = games[roomName].getNextColor(targetPlayer.color);
        } else if (side === -1) {
            newColor = games[roomName].getLastColor(targetPlayer.color);
        }
        targetPlayer.color = newColor;
        io.sockets
            .in(roomName)
            .emit('colorChange', { username: targetPlayer.username, color: targetPlayer.color });
    }
});
