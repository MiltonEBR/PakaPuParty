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

// const handleCreate = (name, priv) => {
//     let roomName = makeid(5);
//     games[roomName] = new Game();
//     return roomName;
// };

// const handleJoin = (name, room) => {
//     if (games[room]) {
//     }
// };

// const game = new Game();
// game.createBox({ x: 245, y: 160 });
io.on('connection', (client) => {
    console.log('s1 conected');
    client.on('joinGame', (msg) => {
        console.log(msg);
        client.emit('startGame');
    });

    client.on('createGame', (msg) => {
        console.log(msg);
    });
    // game.createPlayer();
    // const serializedData = game.serializeAll();
    // client.emit('init', serializedData);
    // console.log('someone conected');
    // setInterval(function () {
    //     let message = game.serializeAll().players;
    //     client.emit('update', message);
    // }, 20);
});
