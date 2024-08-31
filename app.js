const express = require('express');
const app = express();
const http = require('http');
const path = require('path');

// setting up socket.io
const socketio = require('socket.io');
const server = http.createServer(app);
const io = socketio(server);

// setup ejs
app.set('view engine', 'ejs');

// set up a public folder to use by view engine
app.use(express.static(path.join(__dirname, 'public')));

// receiving the data from socket.io, the socket used below gets data from script.js
io.on('connection', function(socket) {
    socket.on('send-location',function(data){   //got data from frontend
        io.emit('receive-location',{id:socket.id , ...data})   //sending receive-locartion to backend
    })
  console.log('connected');
});

// render the index.ejs file
app.get('/', function(req, res) {
    res.render('index');
});

// start the server on port 3000
server.listen(3000, function() {
    console.log('Server is running on port 3000');
});


