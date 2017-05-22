let username = document.querySelector('.username-input');
let chatPage = document.querySelector('.chat');
console.log(chatPage);
let loginPage = document.querySelector('.login');

window.addEventListener('keydown', function(event) {
	if(event.keyCode == 13) {
		loginPage.style.display = "none";
		chatPage.style.display = "block";
	}
})