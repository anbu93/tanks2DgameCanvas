var controller;

function Controller() {
	this.clickEvent = function() {
		//player.jump();
	}
	this.keyDownEvent = function(e) {
		var keyID = e.keyCode || e.wich;
		var keyChar = String.fromCharCode(keyID);
		if (keyChar == "W")
			player.jump();
		if (keyChar == "S")
			;//player.jump();
		if (keyChar == "A")
			player.isMoveLeft = true;
		if (keyChar == "D")
			player.isMoveRight = true;
		if (keyChar == " ")
			player.jump();
		if (keyChar == "R")
			gameReset();
		e.preventDefault();
	}
	this.keyUpEvent = function(e){
		var keyID = e.keyCode || e.wich;
		var keyChar = String.fromCharCode(keyID);
		if (keyChar == "A")
			player.isMoveLeft = false;
		if (keyChar == "D")
			player.isMoveRight = false;
		e.preventDefault();
	}

	document.addEventListener("keydown", this.keyDownEvent, false);
	document.addEventListener("keyup", this.keyUpEvent, false);
	document.addEventListener("click", this.clickEvent, false);
}