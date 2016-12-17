var background;

var background_tileset = new Image();
background_tileset.src = "img/bg2.png";

function Background() {
	this.HEIGHT = GAME_HEIGHT;
	this.WIDTH = 900 * GAME_HEIGHT / 540;
	this.count = parseInt(GAME_WIDTH / this.WIDTH) + 2;
	this.x = 0;
	this.sprite = new StaticSprite(background_tileset, 0, 0, 900, 540);

	this.update = function(elapsed) {
		this.x = this.x - (world.speed * elapsed);
		if (this.x < -this.WIDTH)
			this.x = 0;
	}

	this.draw = function(context) {
		for (var i = 0; i < this.count; i++)
			this.sprite.draw(context, this.x + this.WIDTH * i, 0, this.WIDTH, this.HEIGHT);
	}

	this.reset = function() {
		this.x = 0;
	}
}