var FPS        = 60;
var DELAY      = 4; 
var MIN_LENGTH = 3;
var POINT_SPEC = 10;

function init() {
	var cvs = {
		obj: gel('cvs')
	};
	cvs.ctx = cvs.obj.getContext('2d');
	cvs.width = cvs.obj.width;
	cvs.height = cvs.obj.height;
	
	var bg = new Background(cvs);
	bg.draw();
	
	var x  = cvs.width  / 2;
	var y  = cvs.height / 2;
	var snake = new Snake(x, y, MIN_LENGTH);
	snake.setContext(cvs.ctx);
	snake.setColor('#0f0');
	snake.setClearColor(bg.color);
	
	game.topLeft = {x: 0, y: 0};
	game.bottomRight = {
		x: bg.width  - config.block.width,
		y: bg.height - config.block.height,
	};
	var initPoint = randomPoint(game.topLeft, game.bottomRight);
	var apple = new Apple();
	apple.setContext(cvs.ctx);
	
	initAudio();
	
	var hScore = parseInt(localStorage.getItem('hScore'));
	if (hScore === undefined || hScore === null || isNaN(hScore)) {
		localStorage.setItem('hScore', 0);
		hScore = 0;
	}
	
	game.cvs    = cvs;
	game.bg     = bg;
	game.snake  = snake;
	game.apple  = apple;
	game.timer  = 0;
	game.paused = false;
	game.score  = 0;
	game.hScore = hScore;
	game.oScore = hScore;
	game.oscill = new Oscillator();
}

function togglePause(state) {
	if (state !== null && state !== undefined) {
		game.paused = state;
	} else {
		game.paused = !game.paused;
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
		if (keys['ArrowUp']) {
			snake.direction = dirs.UP;
			playSound('move');
			releaseKey('ArrowUp');
		} else if (keys['ArrowDown']) {
			snake.direction = dirs.DOWN;
			playSound('move');
			releaseKey('ArrowDown');
		}
	} else if (!snake.isHorizontal) {
		if (keys['ArrowLeft']) {
			snake.direction = dirs.LEFT;
			playSound('move');
			releaseKey('ArrowLeft');
		} else if (keys['ArrowRight']) {
			snake.direction = dirs.RIGHT;
			playSound('move');
			releaseKey('ArrowRight');
		}
	}
	
	if (keys['p']) {
		togglePause();
		playSound('pause');
		releaseKey('p');
	}
}

function collide() {
	var snake = game.snake;
	var apple = game.apple;
	var bg    = game.bg;
	var w     = config.block.width;
	var h     = config.block.height;
	var head  = snake.blocks[0];
	
	if (snake.blocks.length > MIN_LENGTH) {
		loopBlocks: for (var b = 1; b < snake.blocks.length; b++) {
			var block = snake.blocks[b];
			if (block.x == head.x && block.y == head.y) {
				bg.draw();
				apple.reinit();
				snake.reset();
				if (game.score > game.oScore) {
					game.oScore = game.score;
				}
				game.score = 0;
				playSound('fail');
				break loopBlocks;
			}
		}
	}
	
	if (snake.head.x + w > bg.width) {
		var newX = 0;
		var newY = snake.head.y;
		snake.wrap(newX, newY);
	} else if (snake.head.x < 0) {
		var newX = bg.width;
		var newY = snake.head.y;
		snake.wrap(newX, newY);
	}
	
	if (snake.head.y + h > bg.height) {
		var newX = snake.head.x;
		var newY = 0;
		snake.wrap(newX, newY);
	} else if (snake.head.y < 0) {
		var newX = snake.head.x;
		var newY = bg.height;
		snake.wrap(newX, newY);
	}
	
	if (snake.head.x == apple.x && snake.head.y == apple.y) {
		if (++game.score % POINT_SPEC == 0) {
			playSound('scorex10');
		} else {
			playSound('eat');
		}
		
		if ((game.score == game.oScore + 1) && (game.oScore > 0)) {
			game.oscill.activate();
			playSound('uphigh');
		}
		if (game.score > game.hScore) {
			game.hScore = game.score;
			localStorage.setItem('hScore', game.hScore);
		}
		
		snake.add();
		snake.oldBlock = {x: apple.x, y: apple.y};
		apple.reinit();
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
}

function cbMain() {
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
}