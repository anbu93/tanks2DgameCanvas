function Controller() {
	this.isMouseInCanvas = false;
	this.clickEvent = function() {}
	this.keyDownEvent = function(e) {
		var keyID = e.keyCode || e.wich;
		var keyChar = String.fromCharCode(keyID);
		// player move forward/backward
		if (keyChar == "A") player.isMoveLeft = true;
		if (keyChar == "D") player.isMoveRight = true;
		// player cannon move (up/down)
		if (keyChar == "W") player.isCannonUp = true;
		if (keyChar == "S") player.isCannonDown = true;
		// player actions (jump/fire)
		if (keyChar == " ") player.jump();
		if (keyChar == "F") player.fire();
		// global
		if (keyChar == "R") gameReset();
		e.preventDefault();
	}
	this.keyUpEvent = function(e){
		var keyID = e.keyCode || e.wich;
		var keyChar = String.fromCharCode(keyID);
		if (keyChar == "A") player.isMoveLeft = false;
		if (keyChar == "D") player.isMoveRight = false;
		if (keyChar == "W") player.isCannonUp = false;
		if (keyChar == "S") player.isCannonDown = false;
		e.preventDefault();
	}

	document.addEventListener("keydown", this.keyDownEvent, false);
	document.addEventListener("keyup", this.keyUpEvent, false);
	document.addEventListener("click", this.clickEvent, false);
}