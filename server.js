var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var { config } = require('dotenv');

// setting up socket.io
var http = require('http').Server(app)

// setting up io and set it to req socket
var io = require('socket.io')(http);
var mongoose = require('mongoose');
const { sendStatus } = require('express/lib/response');

app.use(express.static(__dirname))  
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }));

var dbUrl = process.env.MONGOURI
var port = process.env.PORT || 5000


const options = {
    useUnifiedTopology: true,
    useNewUrlParser: true
}

var Message = mongoose.model('Message', {
    name: String,
    message: String
})

// var messages = [
//     { name: "John", message: "Hello" },
//     { name: "Jane", message: "Hi" } 
// ]
 
app.get('/messages', (req, res) => {
    Message.find({}, (err, messages) => {
        res.send(messages)
    })
})
 
app.post('/messages', (req, res) => {
    var message = new Message(req.body)
    message.save((err) => {
        if (err) 
                sendStatus(500, 'Internal server error');

                // messages.push(req.body) 
                // notifying  users
                io.emit('message', req.body);
                res.sendStatus(200);
            
    })
    
    
});

io.on('connection', () => {
    console.log('user connected')
})

io.on('disconnected', () => {
	console.log('user disconnected');
});

// mongoose.connect(dbUrl, options, (err) => {
//     console.log('mongodb connection successful')
// })

config();

const connectDB = async () => {
	try { 
		await mongoose.connect(process.env.MONGOURI || 5000, options);
		console.log('MongoDB Connected');
	} catch (err) {
		console.error(err.message); 
		// Exit process with failure
		process.exit(1);
	}
};

connectDB();

var server = http.listen(process.env.PORT, () => {
    console.log('Listening on port', port);

}); 
