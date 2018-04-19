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
		snakeobj.minLength = length;
		snakeobj.defaultX = x;
		snakeobj.defaultY = y;

		snakeobj.blocks = [];
		for (var b = 0; b < length; b++) {
			snakeobj.blocks.push({
				x: x + b,
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
};

Snake.prototype.setClearColor = function(color) {
	this.clearColor = color;
};

Snake.prototype.add = function() {
	var block = {};
	var head = this.head;
	
	switch (this.direction) {
		case dirs.RIGHT:
			block.x = head.x + 1;
			block.y = head.y;
			break;
		case dirs.LEFT:
			block.x = head.x - 1;
			block.y = head.y;
			break;
		case dirs.UP:
			block.x = head.x;
			block.y = head.y - 1;
			break;
		case dirs.DOWN:
			block.x = head.x;
			block.y = head.y + 1;
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
	this.ctx.fillStyle = color || this.color;
	this.ctx.fillRect(
         x * BLOCK_W + 1,
         y * BLOCK_H + 1,
         BLOCK_W - 2,
         BLOCK_H - 2
   );
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
