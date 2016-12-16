window.onload = init;
var GAME_WIDTH = 1200;
var GAME_HEIGHT = 500;
var isRunning = false;
var requestAnimFrame = window.requestAnimationFrame ||
								window.webkitRequestAnimationFrame ||
								window.mozRequestAnimationFrame ||
								window.oRequestAnimationFrame ||
								window.msRequestAnimationFrame;
var world_speed = 7;
var isDebugMode = true;
function init() {
	player = new Player();
	background = new Background();
	mines = new Mines();
	Controller();
	startLoop();
}
function startLoop() {
	isRunning = true;
	loop();
}
function loop() {
	if (isRunning){
		draw();
		update();
		requestAnimFrame(loop);
	}
}
function update() {
	background.update();
	player.update();
	mines.update();
}
function draw(){
	player.draw();
	background.draw();
	mines.draw();
}
function stopLoop() {
	isRunning = false;
}

function Rectangle(x, y, w, h){
	this.x = x;
	this.y = y;
	this.w = w;
	this.h = h;

	this.isCollised = function(rect){
		var dx = Math.abs((this.x + this.w/2) - (rect.x + rect.w/2));
		var dy = Math.abs((this.y + this.h/2) - (rect.y + rect.h/2));
		var widths = this.w/2 + rect.w/2;
		var heights = this.h/2 + rect.h/2;
		return dx < widths && dy < heights;
	}


	this.draw = function(context, color, fill) {
		context.strokeStyle = color;
		context.strokeRect(this.x, this.y, this.w, this.h);
		if (fill) {
			context.fillStyle = color;
			context.fill();
		}
	}
}

function gameReset() {
	mines.x = GAME_WIDTH + 200;
	mines.detonationTimer = mines.NOT_ACTIVATED;
	this.x = 0;
	background.x = 0;
	startLoop();
}