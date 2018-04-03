Array.prototype.first = function() {
	return this[0];
};

Array.prototype.last = function() {
	return this[this.length - 1];
};

function gel(id) {
	return document.getElementById(id);
}

function randomInt(min, max, dim) {
	var rand = Math.random() * (max - min + 1) + min;
	rand /= dim;
	return dim * Math.floor(rand);
}

function randomPoint(topLeft, bottomRight, skipX, skipY) {
	var x = randomInt(topLeft.x, bottomRight.x, skipX);
	var y = randomInt(topLeft.y, bottomRight.y, skipY);
	
	return {x: x, y: y};
}