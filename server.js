var express = require('express');
var bodyParser = require('body-parser');
var app = express();

// setting up socket.io
var http = require('http').Server(app)

// setting up io and set it to req socket
var io = require('socket.io')(http);

app.use(express.static(__dirname))  
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }));

var messages = [
    { name: "John", message: "Hello" },
    { name: "Jane", message: "Hi" } 
]
 
app.get('/messages', (req, res) => {
    res.send(messages);
})

app.post('/messages', (req, res) => {
    messages.push(req.body) 
    
    // notifying  users
    io.emit('message', req.body)
    res.sendStatus(200)
});

io.on('connection', () => {
    console.log('user connected')
})

io.on('disconnected', () => {
	console.log('user disconnected');
});

var server = http.listen(3010, () => {
    console.log('Listening on port', server.address().port);

}); 
