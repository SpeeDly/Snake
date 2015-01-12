var express = require('express'); 
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function (req, res) {
    res.sendFile(__dirname + "/app/index.html");
})

app.use("/static", express.static(__dirname + "/app/static"));

io.on('connection', function(socket){
    console.log('a user connected');
});

http.listen(3000, function(){
    console.log("Snake is working");
});