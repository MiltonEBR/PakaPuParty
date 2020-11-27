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

// const clientRooms = {};
// const games = {};

// const game = new Game();
// game.createBox({ x: 245, y: 160 });
const games = {};
const clientRooms = {};

io.on('connection', (client) => {
    console.log('someone conected');

    client.on('createGame', handleCreateGame);
    client.on('joinGame', handleJoinGame);

    function handleCreateGame(msg) {
        const username = msg.username;
        let roomName = makeId(5);
        clientRooms[client.id] = roomName;
        games[roomName] = new Game();

        client.emit('gameCode', roomName);

        client.join(roomName);

        let playerNumber = games[roomName].createPlayer();

        let serializedData = games[roomName].serializeAll();
        serializedData.playerNumber = playerNumber;
        client.emit('init', serializedData);
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
            client.emit('unknownGame');
            return;
        } else if (numClients >= 8) {
            client.emit('gameFull');
            return;
        }

        clientRooms[client.id] = roomName;
        let playerNumber = games[roomName].createPlayer();
        let serializedData = games[roomName].serializeAll();
        serializedData.playerNumber = playerNumber;

        io.sockets
            .in(roomName)
            .emit('playerJoined', games[roomName].playerList[playerNumber - 1].serialize());
        client.emit('gameCode', roomName);
        client.join(roomName);
        client.emit('init', serializedData);

        if (numClients === 1) {
            startInverval(roomName);
        }
    }

    function startInverval(room) {
        const invervalId = setInterval(function () {
            let updateData = games[room].serializeAll().players;
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
    // game.createPlayer();
    // const serializedData = game.serializeAll();
    // client.emit('init', serializedData);
    // console.log('someone conected');
    // setInterval(function () {
    //     let message = game.serializeAll().players;
    //     client.emit('update', message);
    // }, 20);
});
