var http = require('http');
var fs = require('fs');

function handleGet(req, res) {
	let url = req.url === '/' ? "./public/index.html" : "./public" + req.url;
	let type = req.headers.accept.split(",");
	
	fs.readFile(url, (error, data) => {
		if(error) {
			res.writeHead(404, {'Content-Type':'text/plain'});
			res.end();
		}
		res.writeHead(200, {'Content-Type':type[0]});
		res.write(data);
		res.end();
	})
}

var server = http.createServer((req, res) => {
	if (req.method.toLowerCase() === 'get') {
		handleGet(req, res);	
	}
}).listen(8888);

var io = require('socket.io').listen(server);

var numUsers = 0;

io.on('connection', function(socket) {
	numUsers++;
	console.log(numUsers);
	socket.on('disconnect', function() {
		numUsers--;
	})
})