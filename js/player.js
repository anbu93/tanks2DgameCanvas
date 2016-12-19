var player_tileset = new Image();
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
	
	this.sprite = new StaticSprite(player_tileset, 0, 0, 832, 355);
	this.trackCollider = new Rectangle(50, 70, 130, 30); // 60 100 150 30
	this.x = 0;
	this.y = this.LOWER_Y;
	// for moving
	this.isJumped = false;
	this.verticalSpeed = 0; //in pixels per seconds
	this.horizontalSpeed = 0; //in pixels per seconds
	this.isMoveLeft = false;
	this.isMoveRight = false;
	// cannon module
	this.cannon = new Cannon();
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
		this.cannon.update(elapsed);
	}

	this.draw = function(context) {
		context.save(); 
		context.translate(this.x + this.WIDTH/2, this.y + this.HEIGHT/2);
		if (this.verticalSpeed != 0){
			var angle = -this.verticalSpeed * this.SPEED_TO_ANGLE_KOEFFICIENT;
			context.rotate(angle * TO_RADIANS);
		}
		this.cannon.draw(context);
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
		this.cannon.fire();
	}

	this.reset = function() {
		this.isJumped = false;
		this.x = 0;
		this.y = this.LOWER_Y;
		this.verticalSpeed = 0;
		this.horizontalSpeed = 0;
		this.isMoveLeft = false;
		this.isMoveRight = false;
		this.cannon.reset();
	}

}


function Cannon() {
	this.sprite = new StaticSprite(player_tileset, 45, 370, 425, 50);
	this.fire_sprite = new StaticSprite(player_tileset, 0, 425, 200, 250);

	this.MAX_UP_ANGLE = 20; // degrees
	this.MAX_DOWN_ANGLE = 10; // degrees
	this.MAX_SPEED = 10; // degrees in second
	this.FIRE_X_DIFF = 5; // pixels

	this.angle = 0;
	this.cannon_rect = new Rectangle(65, -27, 119.718, 14.08451);
	this.fire_rect = new Rectangle(0, -75, 150, 250);
	this.reloadingTimer = new Timer(2.5); // seconds
	this.fireShowTimer = new Timer(0.10); // seconds
	// for control
	this.isCannonUp = false;
	this.isCannonDown = false;
	this.isFireSignaled = false;

	this.update = function(elapsed){
		// cannon move
		var angle_speed = 0;
		if (this.isCannonUp) angle_speed -= this.MAX_SPEED;
		if (this.isCannonDown) angle_speed += this.MAX_SPEED;
		this.angle += angle_speed * elapsed;
		if (this.angle < -this.MAX_UP_ANGLE) this.angle = -this.MAX_UP_ANGLE;
		if (this.angle > this.MAX_DOWN_ANGLE) this.angle = this.MAX_DOWN_ANGLE;
		// reloading timer
		if (this.reloadingTimer.isFinished == false)
			this.reloadingTimer.update(elapsed);
		// fire signal
		if (this.isFireSignaled){
			this.isFireSignaled = false;
			this.reloadingTimer.start();
			this.fireShowTimer.start();
		}
		// fire show timer
		if (this.fireShowTimer.isFinished == false)
			this.fireShowTimer.update(elapsed);
	}

	this.draw = function(context) {
		context.save();
		context.translate(this.cannon_rect.x, this.cannon_rect.y);
		context.rotate(this.angle * TO_RADIANS);
		var xDifferentForFired = 0;
		if (this.fireShowTimer.isFinished == false)
			xDifferentForFired = -this.FIRE_X_DIFF;
		this.sprite.draw(context, xDifferentForFired, -this.cannon_rect.h/2,
			this.cannon_rect.w, this.cannon_rect.h);
		if (this.fireShowTimer.isFinished == false) // show cannon fire
			this.fire_sprite.draw(context, 
				this.cannon_rect.w + this.fire_rect.x, this.fire_rect.y, 
				this.fire_rect.w, this.fire_rect.h);
		context.restore();
	}

	this.fire = function(){
		if (this.reloadingTimer.isFinished)
			this.isFireSignaled = true;
	}

	this.reset = function() {
		this.angle = 0;
		this.reloadingTimer.stop();
		this.fireShowTimer.stop();
		this.isCannonUp = false;
		this.isCannonDown = false;
		this.isFireSignaled = false;
	}
}