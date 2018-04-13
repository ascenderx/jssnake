var config = {
	block: {
		width:  10,
		height: 10,
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

function Snake(x, y, len) {
	this.construct = function(snakeobj, x, y, length) {
		var w = config.block.width;
		snakeobj.minLength = length;
		snakeobj.defaultX = x;
		snakeobj.defaultY = y;

		snakeobj.blocks = [];
		for (var b = 0; b < length; b++) {
			snakeobj.blocks.push({
				x: x + w * b,
				y: y
			});
		}
		snakeobj.tail = snakeobj.blocks.last();
		snakeobj.head = snakeobj.blocks.first();
		snakeobj.direction = dirs.RIGHT;
		snakeobj.oldBlock = null;
	};
	
	this.construct(this, x, y, len);
}

Snake.prototype.setContext = function(ctx) {
	this.ctx = ctx;
};

Snake.prototype.reset = function() {
	while (this.blocks.length > 0) {
		this.blocks.pop();
	}
	this.construct(this, this.defaultX, this.defaultY, this.minLength);
};

Snake.prototype.setColor = function(color) {
	this.color = color;
}

Snake.prototype.setClearColor = function(color) {
	this.clearColor = color;
};

Snake.prototype.add = function() {
	var block = {};
	var head = this.head;
	var w = config.block.width;
	var h = config.block.height;
	
	switch (this.direction) {
		case dirs.RIGHT:
			block.x = head.x + w;
			block.y = head.y;
			break;
		case dirs.LEFT:
			block.x = head.x - w;
			block.y = head.y;
			break;
		case dirs.UP:
			block.x = head.x;
			block.y = head.y - h;
			break;
		case dirs.DOWN:
			block.x = head.x;
			block.y = head.y + h
			break;
		default:
			throw('Unknown direction "' + this.direction + '"');
	}
	this.blocks.unshift(block);
	this.head = block;
};

Snake.prototype.update = function() {
	// mimic movement by popping off of the tail
	// and adding a block to the head
	this.tail = this.blocks.last();
	this.blocks.pop();
	this.add();
};

Snake.prototype.wrap = function(newX, newY) {
	this.head.x = newX;
	this.head.y = newY;
};

Snake.prototype.drawBlock = function(x, y, color) {
	var w = config.block.width;
	var h = config.block.height;
	
	this.ctx.fillStyle = color || this.color;
	this.ctx.fillRect(x, y, w, h);
};

Snake.prototype.draw = function() {
	// we only need to redraw the tail onto the head
	// the rest of the snake doesn't change
	
	// draw the new head
	this.drawBlock(this.head.x, this.head.y);
	
	// erase the old tail
	this.drawBlock(this.tail.x, this.tail.y, this.clearColor);
	
	// draw over any blocks, if needed
	if (this.oldBlock) {
		this.drawBlock(this.oldBlock.x, this.oldBlock.y);
		this.oldBlock = null;
	}
};