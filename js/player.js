var player;

var player_tileset = new Image();
player_tileset.src = "img/t34.png";


function Player() {
	this.WIDTH = 320;
	this.HEIGHT = 150;
	this.GRAVITY = 2000; // pixels per cuadro seconds
	this.JUMP_ACCELERATION = 600; //pixels per cuadro seconds
	this.MOVE_SPEED = 200; //pixels per seconds
	this.SPEED_TO_ANGLE_KOEFFICIENT = 0.015;
	this.LOWER_Y = GAME_HEIGHT - this.HEIGHT;
	this.isJumped = false;
	this.x = 0;
	this.y = this.LOWER_Y;
	this.verticalSpeed = 0; //in pixels per seconds
	this.horizontalSpeed = 0; //in pixels per seconds
	this.isMoveLeft = false;
	this.isMoveRight = false;
	this.trackCollider = new Rectangle(75, 100, 130, 30); // 60 100 150 30
	this.sprite = new StaticSprite(player_tileset, 0, 0, 1280, 700);

	this.update = function(elapsed){
		if (this.isJumped){
			this.verticalSpeed = this.JUMP_ACCELERATION;
			this.isJumped = false;
		}
		if ((this.verticalSpeed != 0) || (this.y != this.LOWER_Y)){
			this.verticalSpeed = this.verticalSpeed - this.GRAVITY * elapsed;
			this.y = this.y - this.verticalSpeed * elapsed;
			if (this.y > this.LOWER_Y){
				this.y = this.LOWER_Y;
				this.verticalSpeed = 0;
			}
		}
		this.horizontalSpeed = 0;
		if (this.isMoveRight)
			this.horizontalSpeed += this.MOVE_SPEED * elapsed;
		if (this.isMoveLeft)
			this.horizontalSpeed -= world_speed * elapsed;
		this.x += this.horizontalSpeed;
		if (this.x < 0)
			this.x = 0;
		if (this.x > GAME_WIDTH - this.WIDTH)
			this.x = GAME_WIDTH - this.WIDTH;
	}

	this.draw = function(context) {
		if (this.verticalSpeed == 0)
			this.sprite.draw(context, this.x, this.y, this.WIDTH, this.HEIGHT);
		else
			this.sprite.drawRotated(context, this.x, this.y, 
				this.WIDTH, this.HEIGHT, -this.verticalSpeed * this.SPEED_TO_ANGLE_KOEFFICIENT);
		if (isDebugMode) 
			this.getCollider().draw(context, '#FF0000', false);
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

	this.reset = function() {
		this.isJumped = false;
		this.x = 0;
		this.y = this.LOWER_Y;
		this.verticalSpeed = 0;
		this.horizontalSpeed = 0;
		this.isMoveLeft = false;
		this.isMoveRight = false;
	}
}