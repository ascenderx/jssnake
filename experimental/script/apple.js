function Apple() {
	this.construct = function(blocksToAvoid) {
		var point;
		var collides = true;
		
		if (blocksToAvoid && blocksToAvoid.length !== 0) {
			while (collides) {
				point = randomGridPoint(1, 1, GRID_W - 2, GRID_H - 2);
				blocksToAvoid.forEach(function(block) {
					if (block.x != point.x || block.y != point.y) {
						collides = false;
					}
				});
			}
		} else {
			point = randomGridPoint(1, 1, GRID_W - 2, GRID_H - 2);
		}
		
		this.x = point.x
		this.y = point.y;
	};
	this.construct(null);
}

Apple.prototype.setContext = function(ctx) {
	this.ctx = ctx;
};

Apple.prototype.color = '#f00';

Apple.prototype.draw = function() {
	this.ctx.fillStyle = this.color;
	this.ctx.fillRect(
		this.x * BLOCK_W + 1,
		this.y * BLOCK_H + 1,
		BLOCK_W - 2,
		BLOCK_H - 2);
	this.drawn = true;
};