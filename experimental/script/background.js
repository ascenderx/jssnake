function Background(cvs, ctx) {
	this.ctx         = ctx;
	this.width       = cvs.width;
	this.height      = cvs.height;
	this.topLeft     = {x: 0, y: 0};
	this.bottomRight = {
		x: this.topLeft.x + this.width,
		y: this.topLeft.y + this.height
	};
};

Background.prototype.color = '#000';

Background.prototype.draw = function() {
	var x1 = this.topLeft.x;
	var y1 = this.topLeft.y;
	
	this.ctx.fillStyle = this.color;
	this.ctx.fillRect(x1, y1, this.width, this.height);
};