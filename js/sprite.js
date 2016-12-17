var canvas;

function CanvasLayer() {
	this.canvas;
	this.context;
	
	this.init = function(identifier){
		this.canvas = document.getElementById(identifier);
		this.context = this.canvas.getContext("2d");
		this.canvas.width = GAME_WIDTH;
		this.canvas.height = GAME_HEIGHT;
	}

	this.clear = function() {
		this.context.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
	}
}

function StaticSprite(tileSetImage, srcX, srcY, srcW, srcH) {
	this.TO_RADIANS = Math.PI/180; 
	this.tileSet = tileSetImage;
	this.srcX = srcX;
	this.srcY = srcY;
	this.srcW = srcW;
	this.srcH = srcH;
	
	this.animationUpdate = function(deltaTimeMilliseconds){}

	this.draw = function(layer_context, x, y, w, h) {
		layer_context.drawImage(this.tileSet, this.srcX, this.srcY, this.srcW, this.srcH, 
			x, y, w, h);
	}
	this.drawRotated = function(layer_context, x, y, w, h, angle){
		layer_context.save(); 
		layer_context.translate(x + w/2, y + h/2);
		layer_context.rotate(angle * this.TO_RADIANS);
		layer_context.drawImage(this.tileSet, this.srcX, this.srcY, this.srcW, this.srcH, 
			-w/2, -h/2, w, h);
		layer_context.restore();
	}
}

function AnimationSprite(tileSetImage, srcX, srcY, srcW, srcH, tilesCount, frameChangeTimer) {
	this.tileSet = tileSetImage;
	this.srcX = srcX;
	this.srcY = srcY;
	this.srcW = srcW;
	this.srcH = srcH;
	this.sprite = new StaticSprite(tileSetImage, srcX, srcY, srcW, srcH);
	this.tileId = 0;
	this.frameChangeTimer = frameChangeTimer;
	this.frameChangeTimerIterator = 0;
	this.tilesCount = tilesCount;

	this.animationUpdate = function(deltaTimeMilliseconds){
		this.frameChangeTimerIterator += deltaTimeMilliseconds;
		if (this.frameChangeTimerIterator < this.frameChangeTimer) return;
		this.frameChangeTimerIterator = this.frameChangeTimerIterator - this.frameChangeTimer;
		this.tileId = this.tileId + 1;
		if (this.tileId == this.tilesCount)
			this.tileId = 0;
		this.sprite.srcX = this.sprite.srcW * this.tileId;
	}

	this.draw = function(layer_context, x, y, w, h) {
		this.sprite.draw(layer_context, x, y, w, h);
	}
	this.drawRotated = function(layer_context, x, y, w, h, angle) {
		this.sprite.drawRotated(layer_context, x, y, w, h, angle);
	}
}