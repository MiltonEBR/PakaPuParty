const express = require('express');
const fs=require('fs');

const socketio=require('socket.io');

const app=express();

app.use('/public',express.static(`${__dirname}/../client`));

app.get('/',(req,res)=>{
    res.sendFile('index.html',{root:`../client`});
});

app.get('/play',(req,res)=>{
    res.sendFile('lobby.html',{root:`../client`})
})

const server= app.listen(3000,()=>{
    console.log('listening')
});

const io=socketio(server);

