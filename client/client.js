const  socket = require('socket.io-client')('http://localhost:3000')

socket.on('data', data => {
    console.log(data);
})

socket.emit('CreateRoom', "asdasd")

socket.on('join', data => {
    console.log(data);
})
