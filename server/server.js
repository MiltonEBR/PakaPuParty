const express = require('express');
const bodyParser = require('body-parser');
const socketio = require('socket.io');
const Game = require('./game/game');
const app = express();

app.use('/public', express.static(`${__dirname}/../client`));
app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req, res) => {
    res.sendFile('index.html', { root: `../client` });
});

app.get('/play', (req, res) => {
    console.log(req.query);
    res.sendFile('game.html', { root: `../client` });
});

app.post('/play', (req, res) => {
    console.log(req.body);
    let room;
    if (req.body.room) {
        room = 'join';
    } else if (req.body.players) {
        room = 'create';
    }
    res.send(room);
});

const server = app.listen(3000, () => {
    console.log('listening');
});

const io = socketio(server);
const game = new Game();
game.createBoard('debug', { x: 100, y: 300 });
game.createBox({ x: 245, y: 160 });
io.on('connection', (client) => {
    const serializedData = game.serialize();
    client.emit('init', serializedData);
    console.log('someone conected');

    setInterval(function () {
        let message = [...game.serialize().player];
        client.emit('update', message);
    }, 20);
});
