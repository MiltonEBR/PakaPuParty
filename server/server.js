const express = require('express');
const bodyParser = require('body-parser');
const socketio = require('socket.io');

const app = express();
app.use('/public', express.static(`${__dirname}/../client`));
app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req, res) => {
    res.sendFile('index.html', { root: `../client` });
});

app.get('/play', (req, res) => {
    console.log(req.query);
    res.sendFile('lobby.html', { root: `../client` });
});

app.post('/play', (req, res) => {
    console.log(req.body);
    res.send('numero');
});

const server = app.listen(3000, () => {
    console.log('listening');
});

const io = socketio(server);

io.on('connection', (sock) => {
    console.log('someone conected');
});
