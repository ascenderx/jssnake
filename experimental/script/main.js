function init() {
	var ctx = cvs.getContext('2d');
	
	var bg = new Background(cvs, ctx);
	bg.draw();
	
	var x = 0;
	var y = 0;
	var snake = new Snake(x, y, MIN_LENGTH);
	snake.setContext(ctx);
	snake.setColor('#0f0');
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
		updateLocalStorage({'hScore': 0});
		hScore = 0;
	}
	
	game.cvs    = cvs;
	game.ctx    = ctx;
	game.bg     = bg;
	game.snake  = snake;
	game.apple  = apple;
	game.timer  = 0;
	game.paused = false;
	game.score  = 0;
	game.hScore = hScore;
	game.oScore = hScore;
	game.oscill = new Oscillator();
	game.doWrap = false;
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
	if (doResetApple) {
		game.apple.construct(game.snake.blocks);
	}
	if (game.score > game.oScore) {
		game.oScore = game.score;
	}
	game.score = 0;
	if (doPlaySound) {
		playSound('fail');
	}
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
		if (snake.head.x > GRID_W ||
			snake.head.y > GRID_H ||
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
		if (++game.score % POINT_SPEC == 0) {
			game.oscill.setClass('pointspec');
			game.oscill.activate();
			playSound('scorex10');
		} else {
			playSound('eat');
		}
		
		if ((game.score == game.oScore + 1) && (game.oScore > 0)) {
			game.oscill.setClass('uphigh');
			game.oscill.activate();
			playSound('uphigh');
		}
		if (game.score > game.hScore) {
			game.hScore = game.score;
			updateLocalStorage({'hScore': game.hScore});
		}
		
		snake.add();
		snake.oldBlock = {x: apple.x, y: apple.y};
		apple.construct(snake.blocks);
	}
}

function update() {
	game.snake.update();
	lblScore.innerText  = game.score  || 0;
	lblHScore.innerText = game.hScore || 0;
	game.oscill.update();
}

function draw() {
	game.snake.draw();
	game.apple.draw();
	
	/* TODO: Consolidate */
	if (game.oscill.getClass() == 'uphigh') {
		if (game.oscill.isActive()) {
			if (game.oscill.getState()) {
				lblHScore.style.color = '#ff0';
				tdHScore.style.color  = '#ff0';
			} else {
				lblHScore.style.color = '#f70';
				tdHScore.style.color  = '#f70';
			}
		} else {
			lblHScore.style.color = '#0af';
			tdHScore.style.color  = '#fff';
		}
	} else if (game.oscill.getClass() == 'pointspec') {
		if (game.oscill.isActive()) {
			if (game.oscill.getState()) {
				lblScore.style.color = '#0af';
				tdScore.style.color  = '#0af';
			} else {
				lblScore.style.color = '#0ff';
				tdScore.style.color  = '#0ff';
			}
		} else {
			lblScore.style.color = '#0af';
			tdScore.style.color  = '#fff';
		}
	} else {
		lblHScore.style.color = '#0af';
		tdHScore.style.color  = '#fff';
		lblScore.style.color = '#0af';
		tdScore.style.color  = '#fff';
	}
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