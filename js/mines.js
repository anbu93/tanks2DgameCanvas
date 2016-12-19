var mines;

var mines_tileset = new Image();
mines_tileset.src = "img/Mine.png";
var boom_tileset = new Image();
boom_tileset.src = "img/boom.png";

function MinesController(player) {
	this.STATUS_DETONATED = 1;
	this.STATUS_ACTIVATED = 2;
	this.STATUS_SLEEP = 3;
	this.WIDTH = 50;
	this.HEIGHT = 60;
	this.MAX_MINE_SPAWN_TIMER = 4; // seconds
	this.MIN_MINE_SPAWN_TIMER = 2; //seconds
	this.mineSpawnTimer = 0; //seconds
	this.pool = new MinePool();
	this.player = player;
	this.y = GAME_HEIGHT - this.HEIGHT - 20;
	this.sprite = new StaticSprite(mines_tileset, 0, 0, 200, 250);
	this.boom_sprite = new StaticSprite(boom_tileset, 0, 0, 640, 428)
	this.mineCollider = new Rectangle(10, this.y + 45, 30, 20);

	this.isGameOver = undefined;

	this.update = function(elapsed) {
		for(var i = 0; i < this.pool.count; i++) {
			var mine = this.pool.pool[i];
			if (mine.isUsed) {
				if (mine.getCollider(this.mineCollider).isCollised(this.player.getCollider()))
					mine.activate();
				mine.update(elapsed);
			}
		}
		this.mineSpawnTimer-= elapsed;
		if (this.mineSpawnTimer <= 0){
			this.mineSpawnTimer = 
				this.MIN_MINE_SPAWN_TIMER + 
				Math.random() * (this.MAX_MINE_SPAWN_TIMER - this.MIN_MINE_SPAWN_TIMER);
			this.createMine();
		}
	}

	this.draw = function(context) {
		for(var i = 0; i < this.pool.count; i++) {
			var mine = this.pool.pool[i];
			if (mine.isUsed) {
				this.sprite.draw(context, mine.x, this.y, this.WIDTH, this.HEIGHT);
				if (isDebugMode)
					mine.getCollider(this.mineCollider).draw(context, '#FF0000', false);
			}
		}
		if (this.isGameOver != undefined) {
			this.boom_sprite.draw(context, 
				this.isGameOver.x+this.WIDTH/2 - 160, GAME_HEIGHT - 224, 
				320, 214);
			stopLoop();
		}
	}

	this.detonate = function(mine) {
		if (isBombCanDetonated)
			this.isGameOver = mine;
		this.pool.release(mine);
	}

	this.createMine = function() {
		this.pool.get(GAME_WIDTH, this);
	}

	this.reset = function() {
		this.pool.reset();
		this.isGameOver = undefined;
		this.mineSpawnTimer = 0;
	}
}


function Mine(x, controller) {
	this.isUsed = true;
	this.controller = controller;
	this.x = x;
	this.detonationTimer = new Timer(0.25); // in seconds
	this.status = controller.STATUS_SLEEP;

	this.update = function(elapsed) {
		this.x -= world.speed * elapsed;
		if (this.x < -controller.WIDTH * 2){
			this.isUsed = false;
			this.detonationTimer.stop();
			this.status = controller.STATUS_SLEEP;
		}
		if (this.status == controller.STATUS_ACTIVATED){
			this.detonationTimer.update(elapsed);
			if (this.detonationTimer.isFinished)
				this.controller.detonate(this);
		}
	}

	this.activate = function() {
		if (this.status == this.controller.STATUS_SLEEP){
			this.detonationTimer.start();
			this.status = controller.STATUS_ACTIVATED;
		}
	}

	this.getCollider = function(rect) {
		return new Rectangle(this.x + rect.x, rect.y, rect.w, rect.h);
	}

	this.reset = function(x){
		this.isUsed = true;
		this.x = x;
		this.detonationTimer.stop();
		this.status = controller.STATUS_SLEEP;
	}
}


function MinePool() {
	this.pool = [];
	this.count = 0;

	this.get = function(x, controller) {
		for(var i = 0; i < this.count; i++){
			if (this.pool[i] == undefined){
				console.log("Внутренняя ошибка пула: элемент " + i + " undefined!");
				continue;
			}
			if (this.pool[i].isUsed == false){
				this.pool[i].reset(x);
				return this.pool[i];
			}
		}
		this.pool.push(new Mine(x, controller));
		this.count++;
	}

	this.release = function(mine) {
		mine.isUsed = false;
	}

	this.forEach = function(func) {
		for(var i = 0; i < this.count; i++)
			if (this.pool[i].isUsed)
				func(this.pool[i]);
	}

	this.reset = function() {
		this.pool = [];
		this.count = 0;
	}
}