var keys = {};

function setKey(key) {
	if (!(key in keys)) {
        keys[key] = 0;
    }
    keys[key]++;
}

function releaseKey(key) {
	if (key in keys) {
        delete keys[key];
    }
}

window.addEventListener('keydown', function(event) {
	setKey(event.key);
});

window.addEventListener('keyup', function(event) {
	releaseKey(event.key);
});