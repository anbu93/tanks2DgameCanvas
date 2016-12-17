var world;

function World(width, height) {
	this.speed = 300; // px/sec
	this.acceleration = 10; // px/sec^2
	this.WIDTH = width;
	this.HEIGHT = height;

	this.background = new Background();
	this.player = new Player(this.HEIGHT);
	this.mineController = new MinesController(this.player);

	new Controller();

	this.update = function(elapsed){
		this.background.update(elapsed);
		this.player.update(elapsed);
		this.mineController.update(elapsed);
		this.speed += this.acceleration * elapsedSec; 
	}

	this.render = function(canvas) {
		this.background.draw(canvas);
		this.player.draw(canvas);
		this.mineController.draw(canvas);
	}

	this.reset = function() {
		this.speed = 300;
		this.background.reset();
		this.player.reset();
		this.mineController.reset();
	}
}