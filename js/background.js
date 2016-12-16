var background;
var background_layer;

var background_tileset = new Image();
background_tileset.src = "img/bg2.png";

function Background() {
	this.HEIGHT = GAME_HEIGHT;
	this.WIDTH = 900 * GAME_HEIGHT / 540;
	this.count = parseInt(GAME_WIDTH / this.WIDTH) + 2;
	this.x = 0;
	this.sprite = new StaticSprite(background_tileset, 0, 0, 900, 540);

	background_layer = new CanvasLayer();
	background_layer.init('background');

	this.update = function() {
		this.x -= world_speed;
		if (this.x < -this.WIDTH)
			this.x = 0;
	}

	this.draw = function() {
		background_layer.clear();
		for (var i = 0; i < this.count; i++)
			this.sprite.draw(background_layer.context, this.x + this.WIDTH * i, 0, this.WIDTH, this.HEIGHT);
	}
}