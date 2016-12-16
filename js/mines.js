var mines;
var mines_layer;

var mines_tileset = new Image();
mines_tileset.src = "img/Mine.png";
var boom_tileset = new Image();
boom_tileset.src = "img/boom.png";

function Mines() {
	this.STATUS_DETONATED = 1;
	this.STATUS_ACTIVATED = 2;
	this.STATUS_SLEEP = 3;
	this.WIDTH = 50;
	this.HEIGHT = 60;
	this.DETONATION_TIMER = 10;
	this.mines_list = [];
	this.sprite = new StaticSprite(mines_tileset, 0, 0, 200, 250);
	this.boom_sprite = new StaticSprite(boom_tileset, 0, 0, 640, 428)
	this.mineCollider = new Rectangle(10, 45, 30, 20);
	this.y = GAME_HEIGHT - this.HEIGHT - 20;

	mines_layer = new CanvasLayer();
	mines_layer.init('mines');

	this.detonationTimer = this.NOT_ACTIVATED;
	this.NOT_ACTIVATED = -1;
	this.x = GAME_WIDTH;

	this.update = function() {
		this.x -= world_speed;
		if (this.x < -this.WIDTH)
			this.x = GAME_WIDTH + 101;
		if (this.detonationTimer != this.NOT_ACTIVATED)
			this.detonationTimer -= 1;
		if (this.getCollider().isCollised(player.getCollider()))
			mines.detonate();
	}

	this.draw = function() {
		mines_layer.clear();
		/*for (var mine in this.mines_list) {
			this.sprite.draw(mines_layer.context, mine.x, this.y, this.WIDTH, this.HEIGHT);
		}*/
		this.sprite.draw(mines_layer.context, this.x, this.y, this.WIDTH, this.HEIGHT);
		if (isDebugMode)
			this.getCollider().draw(mines_layer.context, '#FF0000', false);
		if (this.detonationTimer == 0) {
			this.boom_sprite.draw(player_layer.context, this.x+this.WIDTH/2 - 160, GAME_HEIGHT - 224, 320, 214);
			stopLoop();
		}
	}

	this.getCollider = function() {
		return new Rectangle(this.x + this.mineCollider.x, this.y + this.mineCollider.y, 
			this.mineCollider.w, this.mineCollider.h);
	}

	this.detonate = function() {
		if (this.detonationTimer == this.NOT_ACTIVATED) //если это убрать - получается нажимная мина
			this.detonationTimer = this.DETONATION_TIMER;
	}
}


function Mine(x, controller) {
	this.controller = controller;
	this.x = x;
	this.detonationTimer = 0;
	this.status = controller.STATUS_SLEEP;

	this.update = function(elapsedTime) {
		this.x -= worldSpeed;
		if (this.status == controller.STATUS_ACTIVATED){
			this.detonationTimer--;
			if (this.detonationTimer == 0)
				this.controller.detonate(this);
		}
	}

	this.activate = function(){
		if (this.status != this.controller.STATUS_SLEEP)
			this.detonationTimer = this.controller.DETONATION_TIMER;
	}

	this.getCollider = function(rect){
		return new Rectangle(this.x + rect.x, rect.y, rect.w, rect.h);
	}
}