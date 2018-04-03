'use strict';

var game = {};

function Background(cvs) {
	this.width  = cvs.width;
	this.height = cvs.height;
	this.ctx    = cvs.ctx;
};

Background.prototype.color = '#000';

Background.prototype.draw = function() {
	this.ctx.fillStyle = this.color;
	this.ctx.fillRect(0, 0, this.width, this.height);
};