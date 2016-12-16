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
	var elapsedTick = 1000 / 60;
	var elapsedSec = elapsedTick / 1000.0;
	setInterval(function (e) {
		if (isRunning) update(elapsedSec);
	}, elapsedTick);
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
function update(elapsed) {
	background.update(elapsed);
	player.update(elapsed);
	mines.update(elapsed);
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
	mines.reset();
	player.reset();
	background.reset();
	startLoop();
	console.clear();
}