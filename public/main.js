var userLogin = true;
var TYPING_TIMER_LENGTH = 800; // ms
var socket = io();
var userName;
var lastTyingTime;

var COLORS = [
    '#e21400', '#91580f', '#f8a700', '#f78b00',
    '#58dc00', '#287b00', '#a8f07a', '#4ae8c4',
    '#3b88eb', '#3824aa', '#a700ff', '#d300e7'
];

var index = Math.ceil(Math.random()*COLORS.length);

let connected = false;
let typing = false;


window.addEventListener('keydown', function(event) {
	if (!(event.ctrlKey || event.metaKey || event.altKey)) {
    	document.querySelector('.input-message').focus();
    }

	if(event.keyCode == 13) {
		if(userLogin) {
			connected = true;
			log("Welcome to Chat");
			changeToChat();
		}
		else {
			userMessaage();
			socket.emit("stop typing");
		}	
	}
	else {
		if(connected && !typing) {
			typing = true;
			socket.emit('is typing');
		}

		lastTyingTime = new Date().getTime();
		setTimeout(() => {
			var nowTime = new Date().getTime();
			if((nowTime - lastTyingTime > TYPING_TIMER_LENGTH) && typing) {
				typing = false;
				socket.emit("stop typing");
			}
		}, TYPING_TIMER_LENGTH);
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

function addTyping(username) {
	let log = document.createElement('li');
	log.classList.add("typing");
	log.dataset.username = username;
	log.innerHTML = username + " is typing";
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

socket.on('connect_error', () => {
	log("attempt to reconnect has failed");
});

socket.on('is typing', (message) => {
	addTyping(message.username);
});

socket.on('stop typing', (username) => {
	let messages = document.querySelector('.messages');
	let logMessage = document.querySelectorAll('.typing');
	logMessage.forEach((element) => {
		if(element.dataset.username == username) {
			element.classList.add('delete');
			setTimeout(() => {
				messages.removeChild(element);
			}, 600);
		} 
	});	
});









