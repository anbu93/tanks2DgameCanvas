function Rectangle(x, y, w, h){
	this.x = x;
	this.y = y;
	this.w = w;
	this.h = h;

	this.isCollised = function(rect){
		var dx = Math.abs((this.x + this.w/2) - (rect.x + rect.w/2));
		var dy = Math.abs((this.y + this.h/2) - (rect.y + rect.h/2));
		var widths = this.w/2 + rect.w/2;
		var heights = this.h/2 + rect.h/2;
		return dx < widths && dy < heights;
	}


	this.draw = function(context, color, fill) {
		context.strokeStyle = color;
		context.strokeRect(this.x, this.y, this.w, this.h);
		if (fill) {
			context.fillStyle = color;
			context.fill();
		}
	}
}