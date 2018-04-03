var config = {
	block: {
		width:  10,
		height: 10,
		color:  '#0f0',
	},
};

var dirs = {
	LEFT:  0,
	UP:    1,
	RIGHT: 2,
	DOWN:  3,
};

var ends = {
	HEAD: 0,
	TAIL: 1,
};

function Snake(x, y, length) {
	var w = config.block.width;
	this.minLength = length;
	
	this.blocks = [];
	for (var b = 0; b < length; b++) {
		this.blocks.push({
			x: x + w * b,
			y: y
		});
	}
	this.tail = this.blocks.last();
	this.head = this.blocks.first();
	this.direction = dirs.RIGHT;
}

Snake.prototype.setContext = function(ctx) {
	this.ctx = ctx;
};

Snake.prototype.reset = function() {
	while (this.blocks.length > this.minLength) {
		this.blocks.pop();
	}
};

Snake.prototype.setClearColor = function(color) {
	this.clearColor = color;
};

Snake.prototype.add = function(end) {
	/* TODO: Consolidate */
	
	var block;
	if (end == ends.HEAD) {
		block = this.blocks.first();
	} else {
		block = this.blocks.last();
	}
	
	var point = {};
	var w = config.block.width;
	var h = config.block.height;
	switch (this.direction) {
		case dirs.RIGHT:
			point.x = block.x;
			if (end == ends.HEAD) {
				point.x += w;
			} else {
				point.x -= w;
			}
			point.y = block.y;
			break;
		case dirs.LEFT:
			point.x = block.x;
			if (end == ends.HEAD) {
				point.x -= w;
			} else {
				point.x += w;
			}
			point.y = block.y;
			break;
		case dirs.UP:
			point.x = block.x;
			point.y = block.y;
			if (end == ends.HEAD) {
				point.y -= h;
			} else {
				point.y += h;
			}
			break;
		case dirs.DOWN:
			point.x = block.x;
			point.y = block.y;
			if (end == ends.HEAD) {
				point.y += h;
			} else {
				point.y -= h;
			}
			break;
		default:
			throw('Unknown direction "' + this.direction + '"');
	}
	// add the new block and update the head/tail
	if (end == ends.HEAD) {
		this.blocks.unshift(point);
		this.head = point;
	} else {
		this.blocks.push(point);
		this.tail = point;
	}
};

Snake.prototype.update = function() {
	// mimic movement by popping off of the tail
	// and adding a block to the head
	this.tail = this.blocks.pop();
	this.add(ends.HEAD);
};

Snake.prototype.wrap = function(newX, newY) {
	this.head.x = newX;
	this.head.y = newY;
};

Snake.prototype.draw = function() {
	var w = config.block.width;
	var h = config.block.height;
	
	// we only need to redraw the tail onto the head
	// the rest of the snake doesn't change
	
	// draw the new head
	this.ctx.fillStyle = config.block.color;
	this.ctx.fillRect(this.head.x, this.head.y, w, h);
	
	// erase the old tail
	this.ctx.fillStyle = this.clearColor;
	this.ctx.fillRect(this.tail.x, this.tail.y, w, h);
};