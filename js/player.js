var player_tileset = new Image();
//player_tileset.src = "img/t34.png";
player_tileset.src = "img/TankT34.png";
var player;

function Player(height) {
	this.WIDTH = 235.2;
	this.HEIGHT = 100;
	this.GRAVITY = 2000; // pixels per cuadro seconds
	this.JUMP_ACCELERATION = 600; //pixels per cuadro seconds
	this.MOVE_SPEED = 200; //pixels per seconds
	this.SPEED_TO_ANGLE_KOEFFICIENT = 0.015;
	this.LOWER_Y = height - this.HEIGHT - 20;
	this.trackCollider = new Rectangle(50, 70, 130, 30); // 60 100 150 30
	this.sprite = new StaticSprite(player_tileset, 0, 0, 835, 355);
	this.x = 0;
	this.y = this.LOWER_Y;
	// for moving
	this.isJumped = false;
	this.verticalSpeed = 0; //in pixels per seconds
	this.horizontalSpeed = 0; //in pixels per seconds
	this.isMoveLeft = false;
	this.isMoveRight = false;
	// for cannon module
	this.CANNON_MAX_UP_ANGLE = 20; // degrees
	this.CANNON_MAX_DOWN_ANGLE = 10; // degrees
	this.CANNON_MAX_SPEED = 10; // degrees in second
	this.CANNON_RELOAD_TIME = 5; // seconds
	this.cannon_sprite = new StaticSprite(player_tileset, 45, 370, 425, 50);
	this.cannon_angle = 0;
	this.cannon_rect = new Rectangle(65, -27, 119.718, 14.08451);
	this.isCannonUp = false;
	this.isCannonDown = false;
	this.isCanFire = true;
	this.isFireSignaled = false;
	this.cannon_reloading_timer = 0;

	player = this;
	
	this.update = function(elapsed){
		// jump
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
		// horizontal move
		this.horizontalSpeed = 0;
		if (this.isMoveRight)
			this.horizontalSpeed += this.MOVE_SPEED * elapsed;
		if (this.isMoveLeft)
			this.horizontalSpeed -= world.speed * elapsed;
		this.x += this.horizontalSpeed;
		if (this.x < 0)
			this.x = 0;
		if (this.x > GAME_WIDTH - this.WIDTH)
			this.x = GAME_WIDTH - this.WIDTH;
		// cannon
		var cannon_angle_speed = 0;
		if (this.isCannonUp) cannon_angle_speed -= this.CANNON_MAX_SPEED;
		if (this.isCannonDown) cannon_angle_speed += this.CANNON_MAX_SPEED;
		this.cannon_angle += cannon_angle_speed * elapsed;
		if (this.cannon_angle < -this.CANNON_MAX_UP_ANGLE)
			this.cannon_angle = -this.CANNON_MAX_UP_ANGLE;
		if (this.cannon_angle > this.CANNON_MAX_DOWN_ANGLE)
			this.cannon_angle = this.CANNON_MAX_DOWN_ANGLE;
	}

	this.draw = function(context) {
		context.save(); 
		context.translate(this.x + this.WIDTH/2, this.y + this.HEIGHT/2);
		if (this.verticalSpeed != 0){
			var angle = -this.verticalSpeed * this.SPEED_TO_ANGLE_KOEFFICIENT;
			context.rotate(angle * TO_RADIANS);
		}
		context.save();
		context.translate(this.cannon_rect.x, this.cannon_rect.y);
		context.rotate(this.cannon_angle * TO_RADIANS);
		this.cannon_sprite.draw(context, 0, -this.cannon_rect.h/2,
			this.cannon_rect.w, this.cannon_rect.h);
		context.restore();
		this.sprite.draw(context, -this.WIDTH/2, -this.HEIGHT/2, this.WIDTH, this.HEIGHT);
		context.restore();
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
		if (this.isCanJump()) this.isJumped = true;
	}

	this.fire = function() {
		if (this.isCanFire) {
			this.isFireSignaled = true;
			console.log("FIRE!!!");
		}
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