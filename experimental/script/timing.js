function Oscillator() {
	var state = 0;
	var delay = 2;
	var timer = 0;
	var oscillations = 0;
	var maxOscillations = 10;
	var active = false;
	var className = null;
	
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
	
	this.getClass = function() {
		return className;
	};
	
	this.setClass = function(c) {
		className = c;
	}
	
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
		className = null;
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