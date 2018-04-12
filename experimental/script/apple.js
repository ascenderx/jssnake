function Apple() {
	var w = config.block.width;
	var h = config.block.height;
	var point = randomPoint(game.topLeft, game.bottomRight, w, h);
	this.x = point.x;
	this.y = point.y;
}

Apple.prototype.setContext = function(ctx) {
	this.ctx = ctx;
};

Apple.prototype.color = '#f00';

Apple.prototype.draw = function() {
	var w = config.block.width;
	var h = config.block.height;
	this.ctx.fillStyle = this.color;
	this.ctx.fillRect(this.x, this.y, w, h);
	this.drawn = true;
};

Apple.prototype.reinit = function() {
	var w = config.block.width;
	var h = config.block.height;
	var point = randomPoint(game.topLeft, game.bottomRight, w, h);
	this.x = point.x;
	this.y = point.y;
	this.drawn = false;
};