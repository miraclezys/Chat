var http = require('http');
var fs = require('fs');

function handleGet(req, res) {
	let url = req.url === '/' ? "./public/index.html" : "./public" + req.url;
	let type = req.headers.accept.split(",");
	//console.log(url);
	fs.readFile(url, (error, data) => {
		if(!error) {
			res.writeHead(200, {'Content-Type':type[0]});
			res.write(data);
			res.end();
		}
		else {
			res.writeHead(404, {'Content-Type':'text/plain'});
			res.end();
		}
	})
};

var server = http.createServer((req, res) => {
	if (req.method.toLowerCase() === 'get') {
		handleGet(req, res);	
	}
}).listen(8888);

var io = require('socket.io').listen(server);

var numUsers = 0;

io.on('connection', (socket) => {
	let addedUser = false;
	socket.on('add user', (name) => {
		addedUser = true;
		socket.username = name;
		++numUsers;

		socket.emit('login', numUsers);

		socket.broadcast.emit('user joined', {
			username: name,
			numUsers: numUsers
		});
	});

	socket.on('new message', (data) => {
		socket.broadcast.emit('add message', {
			message: data.message,
			color: data.color
		});
	});

	socket.on('is typing', () => {
		socket.broadcast.emit('is typing', {
			username: socket.username
		});
	});

	socket.on('stop typing', () => {
		socket.broadcast.emit('stop typing', socket.username);
	});

	socket.on('disconnect', () => {
		if(addedUser) numUsers--;
		socket.broadcast.emit('user left', {
			username: socket.username,
			numUsers: numUsers
		});
	});
	
});

