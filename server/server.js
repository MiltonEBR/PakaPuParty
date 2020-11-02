const express = require('express');
const socketio=require('socket.io');

const app=express();

app.use(express.static(`${__dirname}/../client`));

const server= app.listen(3000,()=>{
    console.log('listening')
});

const io=socketio(server);