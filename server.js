require('dotenv').config()
const express = require('express')
const app = express()
const server = require('http').createServer(app);
const PORT = process.env.PORT || 3000
const PORT_REDIS = process.env.PORT_REDIS || 26379
const mongoose = require('mongoose')
const path = require('path')
const WebSocket = require('ws')
const wss = new WebSocket.Server({
        server
    }, () => {
        console.log("Web Socket is Running 3001");
})
const {GeneratedRoomID} = require('./server/utils/util')
const {init, log} = require('./server/utils/logger')

init("Peplayon")
// ! DATABASE
mongoose.connect('mongodb://localhost:27017/peplayon', {useNewUrlParser:true, useUnifiedTopology:true})
.then(()=> console.log("Connected to Database"))
.catch(err => console.log(err))

// ! REDIS 
// const redis = require('redis')
// const redisClient = redis.createClient({
//     host:'localhost',
//     port:6379
// })

// redisClient.SET(1, "rizqy")



var playerIndex = 1
var conn = []

// ! Web Socket
wss.on('connection', (ws,req, client) => {
    ws.send("Hi from server")
    
    //? Set Player ID
    ws.playerIndex = playerIndex++
     conn.push(ws.playerIndex)
    console.log(conn);

    ws.on('message', (data) => {
        console.log("===" +data);
        // console.log(wss.clients.keys())
    })

    ws.on("close", () => {
        console.log("Closed");
    })
})

wss.on('error', () => {
    console.log("error",ws);
})

wss.on('listening', () => {
    console.log("Server Listen");
})



// ! EXPRESS
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs')
app.use(express.static(path.join(__dirname, 'client')));

app.use('/auth' , require('./server/controller/auth'))
app.use('/test', (reqr,res,next) => {
    res.send("adsdas")
})

// ! Game API
app.use('/api', require('./server/controller/api'))
app.use('/matchmaker', require('./server/controller/matchmaker-controller'))
app.use('/updateUser', require('./server/controller/updatedata-controller'))

app.use('/' , (req,res) => {
    res.status(200).json({data : "Success"})
})


// ! LISTENER
server.listen(PORT, () => {
    console.log(`Listen on ${PORT}`)
})




// const io = require('socket.io')(server)

//  ! SOCKET.IO
// io.on('connection' , socket => {
//     console.log("New User Connetc");
//     socket.emit("join", `Client ${playerIndex+=1}`)
//     console.log(`[CLIENT] Index : ${playerIndex} ID: ${socket.id}`);
    
//     socket.on('join' , mes => {
//         console.log(mes);
//     })
//     socket.on('CreateRoom' , mes => {
//         console.log(mes, GeneratedRoomID());
//     })

//     socket.on('disconnect', reason => {
//         console.log(`[DISCONNECT] Index : ${playerIndex} ID: ${socket.id} reason : ${reason}`);
//     })
// })