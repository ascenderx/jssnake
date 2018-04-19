function Oscillator(name) {
	var state = 0;
	var delay = 2;
	var timer = 0;
	var oscillations = 0;
	var maxOscillations = 10;
	var active = false;
	var className = name || null;
	var callback = null;
	var fcallback = null;
	
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
		className = null;
	};
	
	this.setCallback = function(cb) {
		callback	= cb;
	};
	
	this.clearCallback = function() {
		callback = null;
	};
	
	this.execCallback = function() {
		if (callback) {
			callback(state, oscillations);
		}
	};
	
	this.setFinalCallback = function(cb) {
		fcallback = cb;
	};
	
	this.execFinalCallback = function() {
		if (fcallback) {
			fcallback();
		}
	};
	
	this.clearFinalCallback = function() {
		fcallback = null;
	};
	
	this.reset = function() {
		state = 0;
	};
	
	this.update = function() {
		if (!active) {
			return;
		}
	
		if (timer % delay === 0) {
			if (oscillations < maxOscillations) {
				state = !state;
				oscillations++;
				this.execCallback();
			} else {
				this.deactivate();
				this.execFinalCallback();
			}
		}
		timer++;
	};
}