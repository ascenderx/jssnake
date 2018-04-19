function init() {
	var ctx = cvs.getContext('2d');
	
	var bg = new Background(cvs, ctx);
	bg.draw();
	
	var x = 0;
	var y = 0;
	var snake = new Snake(x, y, MIN_LENGTH);
	game.colorI = 0;
	snake.setContext(ctx);
	snake.setColor(COLORS[game.colorI]);
	snake.setClearColor(bg.color);
	
	game.topLeft = {x: 0, y: 0};
	game.bottomRight = {
		x: bg.width  - BLOCK_W,
		y: bg.height - BLOCK_H,
	};
	var apple = new Apple();
	apple.setContext(ctx);
	
	initAudio();
	
	var hScore = getLocalStorage('hScore');
	if (hScore === undefined || hScore === null || isNaN(hScore)) {
		hScore = 0;
		updateLocalStorage({'hScore': hScore});
	}
	
	var rScore = getSessionStorage('rScore');
	if (rScore === undefined || rScore === null || isNaN(rScore)) {
		rScore = 0;
		updateSessionStorage({'rScore': rScore});
	}
	
	game.cvs    = cvs;
	game.ctx    = ctx;
	game.bg     = bg;
	game.snake  = snake;
	game.apple  = apple;
	game.timer  = 0;
	game.paused = false;
	game.score  = 0;
	game.rScore = rScore;
	game.pScore = rScore;
	game.hScore = hScore;
	game.oScore = hScore;
	game.osc1   = new Oscillator('uphigh');
	game.osc2   = new Oscillator('pointspec');
	game.osc3   = new Oscillator('beatlast');
	game.doWrap = false;
	
	initCallbacks();
}

function initCallbacks() {
	game.osc1.setCallback(function(state, oscillations) {
		if (state) {
			lblHScore.style.color = '#ff0';
			tdHScore.style.color  = '#ff0';
		} else {
			lblHScore.style.color = '#f70';
			tdHScore.style.color  = '#f70';
		}
	});
	game.osc1.setFinalCallback(function() {
		lblHScore.style.color = '#0af';
		tdHScore.style.color  = '#fff';
	});
	game.osc1.execFinalCallback();
	
	game.osc2.setCallback(function(state, oscillations) {
		if (state) {
			lblScore.style.color = '#0af';
			tdScore.style.color  = '#0af';
		} else {
			lblScore.style.color = '#0ff';
			tdScore.style.color  = '#0ff';
		}
	});
	game.osc2.setFinalCallback(function() {
		lblScore.style.color = '#0af';
		tdScore.style.color  = '#fff';
	});
	game.osc2.execFinalCallback();
	
	game.osc3.setCallback(function(state, oscillations) {
		if (state) {
			lblRecent.style.color = '#f0f';
			tdRecent.style.color  = '#f0f';
		} else {
			lblRecent.style.color = '#f07';
			tdRecent.style.color  = '#f07';
		}
	});
	game.osc3.setFinalCallback(function() {
		lblRecent.style.color = '#0af';
		tdRecent.style.color  = '#fff';
	});
	game.osc3.execFinalCallback();
}

function togglePause(state) {
	if (state !== null && state !== undefined) {
		game.paused = state;
	} else {
		game.paused = !game.paused;
	}
	
	if (game.paused) {
		tdPaused.style.display = 'inline';
	} else {
		tdPaused.style.display = 'none';
	}
	
	playSound('pause');
}

function toggleWrapping(state) {
	if (state !== null && state !== undefined) {
		game.doWrap = state;
	} else {
		game.doWrap = !game.doWrap;
	}
	
	if (game.doWrap) {
		playSound('wrapon');
		tdWrapping.style.display = 'inline';
	} else {
		playSound('wrapoff');
		tdWrapping.style.display = 'none';
	}
}

function input() {
	var snake = game.snake;
	snake.isHorizontal = (
		snake.direction == dirs.RIGHT || snake.direction == dirs.LEFT
	);
	snake.isVertical = (
		snake.direction == dirs.DOWN || snake.direction == dirs.UP
	);
	
	if (!snake.isVertical) {
		if (keys.ArrowUp || keys.w) {
			snake.direction = dirs.UP;
			playSound('move');
			releaseKey('ArrowUp');
			releaseKey('w');
		} else if (keys.ArrowDown || keys.s) {
			snake.direction = dirs.DOWN;
			playSound('move');
			releaseKey('ArrowDown');
			releaseKey('s');
		}
	} else if (!snake.isHorizontal) {
		if (keys.ArrowLeft || keys.a) {
			snake.direction = dirs.LEFT;
			playSound('move');
			releaseKey('ArrowLeft');
			releaseKey('a');
		} else if (keys.ArrowRight || keys.d) {
			snake.direction = dirs.RIGHT;
			playSound('move');
			releaseKey('ArrowRight');
			releaseKey('d');
		}
	}
	
	if (keys.p) {
		togglePause();
		releaseKey('p');
	}
	
	if (keys.t) {
		toggleWrapping();
		releaseKey('t');
	}
}

function fail(doPlaySound, doResetApple) {
	game.bg.draw();
	game.snake.reset();
	game.colorI = 0;
	game.snake.setColor(COLORS[game.colorI]);
	if (doResetApple) {
		game.apple.construct(game.snake.blocks);
	}
	if (game.score > game.oScore) {
		game.oScore = game.score;
	}
	game.oScore = game.hScore;
	game.pScore = game.rScore;
	game.score = 0;
	if (doPlaySound) {
		playSound('fail');
	}
}

function increaseScore() {
	if (++game.score % POINT_SPEC === 0) {
		game.osc2.activate();
		playSound('scorex10');
	} else {
		playSound('eat');
	}
	
	if (game.score % COLOR_PER === 0) {
		// for every 20 points, change the color
		game.colorI++;
		game.colorI %= COLORS.length;
		game.snake.setColor(COLORS[game.colorI]);
	}
	
	if ((game.score == game.pScore + 1) && (game.pScore > 0)) {
		game.osc3.activate();
		playSound('uphigh');
	}
	if (game.score > game.rScore) {
		game.rScore = game.score;
		updateSessionStorage({'rScore': game.rScore});
	}
	
	if ((game.score == game.oScore + 1) && (game.oScore > 0)) {
		game.osc1.activate();
		playSound('uphigh');
	}
	if (game.score > game.hScore) {
		game.hScore = game.score;
		updateLocalStorage({'hScore': game.hScore});
	}
	
	game.snake.add();
	game.snake.oldBlock = {x: game.apple.x, y: game.apple.y};
	game.apple.construct(game.snake.blocks);
}

function collide() {
	var snake = game.snake;
	var apple = game.apple;
	var bg    = game.bg;
	var head  = snake.blocks[0];
	
	if (snake.blocks.length > MIN_LENGTH) {
		for (var b = 1; b < snake.blocks.length; b++) {
			var block = snake.blocks[b];
			if (block.x == head.x && block.y == head.y) {
				fail(true);
				break;
			}
		}
	}
	
	if (game.doWrap) {
		if (snake.head.x >= GRID_W) {
			var newX = 0;
			var newY = snake.head.y;
			snake.wrap(newX, newY);
		} else if (snake.head.x < 0) {
			var newX = GRID_W;
			var newY = snake.head.y;
			snake.wrap(newX, newY);
		}
	
		if (snake.head.y >= GRID_H) {
			var newX = snake.head.x;
			var newY = 0;
			snake.wrap(newX, newY);
		} else if (snake.head.y < 0) {
			var newX = snake.head.x;
			var newY = GRID_H;
			snake.wrap(newX, newY);
		}
	} else {
		if (snake.head.x >= GRID_W ||
			snake.head.y >= GRID_H ||
		    snake.head.x < 0 ||
		    snake.head.y < 0) {
			var doPlaySound  = false;
			var doResetApple = false;
			if (snake.blocks.length > snake.minLength) {
				doPlaySound  = true;
				doResetApple = true;
			}
			fail(doPlaySound, doResetApple);
		}
	}
	
	if (snake.head.x == apple.x && snake.head.y == apple.y) {
		increaseScore();
	}
}

function update() {
	game.snake.update();
	lblScore.innerText  = game.score  || 0;
	lblRecent.innerText = game.rScore || 0;
	lblHScore.innerText = game.hScore || 0;
	game.osc1.update();
	game.osc2.update();
	game.osc3.update();
}

function draw() {
	game.snake.draw();
	game.apple.draw();
}

window.addEventListener('load', function() {
	init();
	setInterval(function tick() {
		if (game.timer % DELAY === 0) {
			input();
			if (!game.paused) {
				update();
				collide();
				draw();
			}
		}
		game.timer++;
	}, 1000/FPS);
});