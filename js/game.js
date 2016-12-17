window.onload = init;
var GAME_WIDTH = 1200;
var GAME_HEIGHT = 500;
var isRunning = false;
var requestAnimFrame = window.requestAnimationFrame ||
								window.webkitRequestAnimationFrame ||
								window.mozRequestAnimationFrame ||
								window.oRequestAnimationFrame ||
								window.msRequestAnimationFrame;
var frames_per_seconds = 300;
var elapsedSec =  1.0 / frames_per_seconds;
// для разработчика
var isDebugMode = true; //включает режим дебагинга (отображает коллайдеры)
var isBombCanDetonated = true; //выключает взрыв мин.

function init() {
	canvas = new CanvasLayer();
	canvas.init('game');
	world = new World(GAME_WIDTH, GAME_HEIGHT);
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
		render();
		requestAnimFrame(loop);
	}
}
function update() {
	world.update(elapsedSec);
}
function render(){
	canvas.clear();
	world.render(canvas.context);
}
function stopLoop() {
	isRunning = false;
}

function gameReset() {
	world.reset();
	startLoop();
	console.clear();
}