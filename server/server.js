const express = require('express');
const bodyParser = require('body-parser');
const socketio = require('socket.io');
const Matter = require('matter-js');
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
const player = Matter.Bodies.rectangle(100, 100, 50, 50);

function serialize(player) {
    const vertices = player.map((data) => {
        return { x: data.x, y: data.y };
    });

    return vertices;
}
let data = serialize(player.vertices);
io.on('connection', (client) => {
    client.emit('init', [{ id: player.id, position: player.position, vertices: data }]);
    console.log('someone conected');

    setInterval(function () {
        data = serialize(player.vertices);
        let message = [{ id: 0, position: player.position, vertices: data }];
        Matter.Body.translate(player, { x: 5, y: 0 });
        client.emit('update', message);
    }, 1000);
});
