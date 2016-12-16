var player;
var player_layer;

var player_tileset = new Image();
player_tileset.src = "img/t34.png";


function Player() {
	this.WIDTH = 320;
	this.HEIGHT = 150;
	this.GRAVITY = 0.4;
	this.JUMP_ACCELERATION = 9;
	this.MOVE_SPEED = 5;
	this.LOWER_Y = GAME_HEIGHT - this.HEIGHT;
	this.isJumped = false;
	this.x = 0;
	this.y = this.LOWER_Y;
	this.verticalSpeed = 0;
	this.horizontalSpeed = 0;
	this.isMoveLeft = false;
	this.isMoveRight = false;

	this.trackCollider = new Rectangle(60, 100, 150, 30);

	this.sprite = new StaticSprite(player_tileset, 0, 0, 1280, 700);
	// constructor
	player_layer = new CanvasLayer();
	player_layer.init('player');

	this.update = function(){
		if (this.isJumped){
			this.verticalSpeed = this.JUMP_ACCELERATION;
			this.isJumped = false;
		}
		if ((this.verticalSpeed != 0) || (this.y != this.LOWER_Y)){
			this.verticalSpeed -= this.GRAVITY;
			this.y -= this.verticalSpeed;
			if (this.y > this.LOWER_Y){
				this.y = this.LOWER_Y;
				this.verticalSpeed = 0;
			}
		}
		this.horizontalSpeed = 0;
		if (this.isMoveRight)
			this.horizontalSpeed += this.MOVE_SPEED * 0.5;
		if (this.isMoveLeft)
			this.horizontalSpeed -= this.MOVE_SPEED;
		this.x += this.horizontalSpeed;
		if (this.x < 0)
			this.x = 0;
		if (this.x > GAME_WIDTH - this.WIDTH)
			this.x = GAME_WIDTH - this.WIDTH;
	}

	this.draw = function() {
		player_layer.clear();
		if (this.verticalSpeed == 0)
			this.sprite.draw(player_layer.context, this.x, this.y, this.WIDTH, this.HEIGHT);
		else
			this.sprite.drawRotated(player_layer.context, this.x, this.y, 
				this.WIDTH, this.HEIGHT, -this.verticalSpeed);
		if (isDebugMode) 
			this.getCollider().draw(player_layer.context, '#FF0000', false);
	}

	this.getCollider = function() {
		return new Rectangle(this.trackCollider.x + this.x, this.trackCollider.y + this.y, 
			this.trackCollider.w, this.trackCollider.h);
	}

	this.isCanJump = function() {
		return this.verticalSpeed == 0 && this.y == this.LOWER_Y;
	}

	this.jump = function() {
		if (this.isCanJump())
				this.isJumped = true;
	}
}