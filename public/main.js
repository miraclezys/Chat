var userLogin = true;
var socket = io();
var userName;

var COLORS = [
    '#e21400', '#91580f', '#f8a700', '#f78b00',
    '#58dc00', '#287b00', '#a8f07a', '#4ae8c4',
    '#3b88eb', '#3824aa', '#a700ff', '#d300e7'
];

var index = Math.ceil(Math.random()*COLORS.length);

window.addEventListener('keydown', function(event) {
	if(event.keyCode == 13) {
		if(userLogin) {
			log("Welcome to Chat");
			changeToChat();
		}
		else {
			userMessaage();
		}	
	}
});

function changeToChat() {
	userName = document.querySelector('.username-input').value;
	document.querySelector('.login').style.display = "none";
	document.querySelector('.chat').style.display = "block";
	userLogin = false;
	socket.emit("add user", userName);
};

function log(message) {
	let log = document.createElement('li');
	log.innerHTML = message;
	log.classList.add('log');
	document.querySelector('.messages').appendChild(log);
}

function addMessage(value, index) {
	let log = document.createElement('li');
	log.innerHTML = "<span class='username' style='color: " + COLORS[index] + "'>" + userName + "</span><span>" + value + "</span>";
	log.classList.add('message');
	document.querySelector('.messages').appendChild(log);
}

function userMessaage() {
	let input = document.querySelector('.input-message');
	let value = input.value;
	addMessage(value, index);
	input.value = "";
	socket.emit('new message',{
		message: value,
		color: index
	});
}

socket.on('login', (num) => {
	log("there are " + num + " participants");
});

socket.on('user joined', (data) => {
	log(data.username + " joined");
	log("there are " + data.numUsers + " participants");
});

socket.on('user left', (data) => {
	log(data.username + " left");
	log("there are " + data.numUsers + " participants");
});

socket.on('add message', (data) => {
	addMessage(data.message, data.color);
});









