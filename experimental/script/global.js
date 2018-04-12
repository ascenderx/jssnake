'use strict';

function gel(id) {
	return document.getElementById(id);
}

const game      = {};
const lblScore  = gel('lbl-score');
const lblHScore = gel('lbl-hscore');
const tdHScore  = gel('td-hscore');

function Background(cvs) {
	this.ctx         = cvs.ctx;
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

function Oscillator() {
	var state = 0;
	var delay = 2;
	var timer = 0;
	var oscillations = 0;
	var maxOscillations = 10;
	var active = false;
	
	this.getMaxOscillations = function() {
		return maxOscillations;
	};
	
	this.setMaxOscillations = function(m) {
		maxOscillations = m;
	};
	
	this.getState = function() {
		return state;
	};
	
	this.getDelay = function() {
		return delay;	
	};
	
	this.setDelay = function(d) {
		delay = d;
	};
	
	this.getTimer = function() {
		return timer;
	};
	
	this.isActive = function() {
		return active;
	};
	
	this.activate = function() {
		active = true;
	};
	
	this.deactivate = function() {
		active = false;
		oscillations = 0;
		timer = 0;
	};
	
	this.reset = function() {
		state = 0;
	};
	
	this.update = function() {
		if (!active) {
			return;
		}
	
		if (timer % delay == 0) {
			if (oscillations < maxOscillations) {
				state = !state;
				oscillations++;
			} else {
				this.deactivate();
			}
		}
		timer++;
	}
}