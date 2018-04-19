'use strict';

function gel(id) {
	return document.getElementById(id);
}

Array.prototype.first = function() {
	return this[0];
};

Array.prototype.last = function() {
	return this[this.length - 1];
};

function gel(id) {
	return document.getElementById(id);
}

function randomInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1) + min);
}

function randomGridPoint(tlX, tlY, brX, brY) {
	var x = randomInt(tlX, brX);
	var y = randomInt(tlY, brY);
	
	return {x: x, y: y};
}

function updateLocalStorage(obj) {
	try {
		for (var key in obj) {
			window.localStorage.setItem(key, JSON.parse(obj[key]));
		}
	} catch (err) {
		/* */
	}
}

function updateSessionStorage(obj) {
	try {
		for (var key in obj) {
			window.sessionStorage.setItem(key, JSON.parse(obj[key]));
		}
	} catch (err) {
		/* */
	}
}

function getLocalStorage(key) {
	var value;
	try {
		value = JSON.parse(window.localStorage.getItem(key));
	} catch (err) {
		value = null;
	}
	return value;
}

function getSessionStorage(key) {
	var value;
	try {
		value = JSON.parse(window.sessionStorage.getItem(key));
	} catch (err) {
		value = null;
	}
	return value;
}