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

function cbKeyPress(event) {
	setKey(event.key);
}

function cbKeyRelease(event) {
	releaseKey(event.key);
}