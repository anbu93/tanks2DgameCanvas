window.onload = init;
var GAME_WIDTH = 1200;
var GAME_HEIGHT = 500;
var isRunning = false;
var requestAnimFrame = window.requestAnimationFrame ||
								window.webkitRequestAnimationFrame ||
								window.mozRequestAnimationFrame ||
								window.oRequestAnimationFrame ||
								window.msRequestAnimationFrame;
var world_speed = 300; //pixels per seconds
var frames_per_seconds = 300;
var elapsedSec =  1.0 / frames_per_seconds;
// для разработчика
var isDebugMode = true; //включает режим дебагинга (отображает коллайдеры)
var isBombCanDetonated = true; //выключает взрыв мин.

function init() {
	player = new Player();
	background = new Background();
	mines = new Mines();
	canvas = new CanvasLayer();
	canvas.init('game');
	Controller();
	startLoop();
	setInterval(function (e) {
		if (isRunning) update();
	}, 1000 / frames_per_seconds);
}

function startLoop() { 
	isRunning = true;
	loop();
}

function loop() {
	if (isRunning){
		draw();
		requestAnimFrame(loop);
	}
}
function update() {
	world_speed += 10 * elapsedSec; // increment 10 pixels/seconds in seconds.
	background.update(elapsedSec);
	player.update(elapsedSec);
	mines.update(elapsedSec);
}
function draw(){
	canvas.clear();
	player.draw(canvas.context);
	background.draw(canvas.context);
	mines.draw(canvas.context);
}
function stopLoop() {
	isRunning = false;
}

function gameReset() {
	mines.reset();
	player.reset();
	background.reset();
	world_speed = 300;
	startLoop();
	console.clear();
}