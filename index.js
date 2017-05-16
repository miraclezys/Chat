
var http = require('http');

var fs = require('fs');

var server = http.createServer((request, response) => {
	fs.readFile('./index.html', (error, data) => {
		if(error) throw error;
		response.writeHead(200, {'Content-Type':'text/html'});
		response.write(data);
		response.end();
	})
}).listen(8888);

var io = require('socket.io').listen(server);

io.on('connection', function(socket) {
	console.log("a user connected");
	socket.on('chat message', function(msg) {
		console.log(msg);
		io.emit('chat message', msg);
	})
})

/*
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
  console.log('a user connected');
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
*/