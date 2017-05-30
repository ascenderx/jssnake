// snake.js

/* NOTE: getDomById() inherited from menu.js */

// canvas globals
var canvas     = domById('gc');
var context    = canvas.getContext('2d');
var lblScore   = domById('lblScore');
var lblRecent  = domById('lblRecent');
var lblHScore  = domById('lblHScore');
var lblPaused  = domById('lblPaused');
var divScore   = domById('divScore');
var divRecent  = domById('divRecent');
var divHScore  = domById('divHScore');
var chkSound   = domById('chkSound');
var chkExtra   = domById('chkExtra');
var divExtra   = domById('divExtra');
var chkScore   = domById('chkScore');
var chkRecent  = domById('chkRecent');
var chkHScore  = domById('chkHScore');
var menuLink   = domById('menu-link');
var submenu    = domById('submenu');
var fps;
var showMenu;

// game globals
var dim;     // snake & apple block width & height
var ax;      // apple position X
var ay;      // apple position Y
var dx;      // snake velocity Dx
var dy;      // snake velocity Dy
var mag;     // (maximum) magnitude of velocity
var snake;   // snake body (array of blocks)
var score;   // current score
var recent;  // most recent score
var hScore;  // high score
var paused;  // is the game paused?
var doWrap;  // is wrapping allowed?
var sound1;  // 'move' sound
var sound2;  // 'eat apple' sound
var sound3;  // 'fail' sound
var sound4;  // 'pause' sound
var sound5;  // 'beat high score' sound
var sound6;  // 'wrap on' sound
var sound7;  // 'wrap off' sound
var sound8;  // 'score x10' sound

/******************
 * INITIALIZATION *
 ******************/
window.onload = function()
{
   // initialize globals
   fps      = 15;
   dim      = 10;
   mag      = dim;
   dx       = mag;
   dy       = 0;
   score    = 0;
   recent   = 0;
   hScore   = 0;
   paused   = false;
   doWrap   = false;
   showMenu = false;
   sound1   = new Audio('wav/move.wav');
   sound2   = new Audio('wav/eat2.wav');
   sound3   = new Audio('wav/fail2.wav');
   sound4   = new Audio('wav/pause.wav');
   sound5   = new Audio('wav/uphigh.wav');
   sound6   = new Audio('wav/wrapon.wav');
   sound7   = new Audio('wav/wrapoff.wav');
   sound8   = new Audio('wav/scorex10.wav');
   
   // hide the instructions by default
   chkExtra.checked = false;
   divExtra.hidden  = true;
   
   // enable sounds by default
   chkSound.checked = true;
   
   // show/hide scores by default
   chkScore.checked  = false;
   chkRecent.checked = false;
   chkHScore.checked = true;
   
   // generate the apple
   regenApple();
   
   // generate the snake
   regenSnake();
   
   // run the loop
   setInterval(function()
   {
      // draw the things
      drawAll();
      
      // update the things, if not paused
      if (!paused)
      {
         updateAll();
         detectCollisions();
      }
      
      // print data to the HTML document
      printData();
      
      // every 1/fps seconds
   }, 1000.0/fps);
}

/*************************
 * SHOW/HIDE EXTRA DATA  *
 *************************/
chkExtra.onchange = function()
{
   divExtra.hidden = !chkExtra.checked;
}

/***********************
 * TOGGLE WRAP ABILITY *
 ***********************/
lblWrap.onclick = function()
{
   // toggle wrap
   doWrap = !doWrap;
   
   if (doWrap)
   {
      lblWrap.style.color = '#00ff00';
      lblWrap.innerHTML   = 'WRAP ENABLED';
      
      // play sound
      playSound(sound6);
   }
   else
   {
      lblWrap.style.color = '#0f0f0f';
      lblWrap.innerHTML   = 'WRAP DISABLED';
      
      // play sound
      playSound(sound7);
   }
}

/***********************
 * MENU CLICK CALLBACK *
 ***********************/
menuLink.onclick = function()
{
   // toggle menu visibility
   showMenu = !showMenu;
   
   if (showMenu)
   {  
      // pause game
      paused = true;
      
      // show menu
      submenu.style.display = 'block';
   }
   else // !showMenu
   {
      // hide menu
      submenu.style.display = 'none';
   }
}

/*********************
 * KEYBOARD CALLBACK *
 *********************/
document.onkeydown = function(event)
{
   switch(event.keyCode)
   {
      // a
      case 65:
      // left
      case 37:
         // prohibit turning right
         if (dx == 0 && dy != 0)
         {
            // turn to the left
            dx = -mag;
            dy = 0;
            
            // play sound
            playSound(sound1);
         }
         break;
     
      // w
      case 87:
      // up
      case 38:
         // prohibit turning downward
         if (dx != 0 && dy == 0)
         {
            // turn upward
            dx = 0;
            dy = -mag;
            
            // play sound
            playSound(sound1);
         }
         break;
      
      // d
      case 68:
      // right
      case 39:
         // prohibit turning left
         if (dx == 0 && dy != 0)
         {
            // turn to the right
            dx = mag;
            dy = 0;
            
            // play sound
            playSound(sound1);
         }
         break;
      
      // s
      case 83:
      // down
      case 40:
         // prohibit moving upward
         if (dx != 0 && dy == 0)
         {
            // turn downward
            dx = 0;
            dy = mag;
            
            // play sound
            playSound(sound1);
         }
         break;
      
      // p
      case 80:
      // pause / break
      case 19:
         paused = !paused;
         
         // play sound
         playSound(sound4);
         break;
   }
}

/*****************************
 * UPDATE ALL OBJECTS & DATA *
 *****************************/
function updateAll()
{
   // move the snake
   var sl = snake.length - 1;            
   snake.push({x: snake[sl].x + dx, y: snake[sl].y + dy});
   snake.shift();            
}

/******************************
 * PRINT DATA TO THE DOCUMENT *
 ******************************/
function printData()
{
   // update labels
   lblScore.innerHTML   = score;
   lblRecent.innerHTML  = recent;
   lblHScore.innerHTML  = hScore;

   
   // show/hide 'PAUSED'
   if (paused)
      lblPaused.innerHTML = 'PAUSED';
   else
      lblPaused.innerHTML = '';
      
   // show/hide current score
   if (chkScore.checked)
      divScore.style.display = 'block';
   else
      divScore.style.display = 'none';
   
   // show/hide recent score
   if (chkRecent.checked)
      divRecent.style.display = 'block';
   else
      divRecent.style.display = 'none';
      
   // show/hide high score
   if (chkHScore.checked)
      divHScore.style.display = 'block';
   else
      divHScore.style.display = 'none';
}

/*************************
 * DETECT ALL COLLISIONS *
 *************************/
function detectCollisions()
{
   // if snake eats apple, move it and grow snake
   var sl = snake.length - 1;
   if (snake[sl].x == ax && snake[sl].y == ay)
   {
      regenApple();
      snake.unshift({x: snake[sl].x - dx, y: snake[sl].y - dy});
      score++;
      
      // play sound
      if (hScore == 0 || score != hScore + 1)
      {
         if (score > 0 && (score % 10 == 0))
            playSound(sound8);
         else
            playSound(sound2);
      }
      else if (score == hScore + 1)
         playSound(sound5);
   }
   
   // if snake eats itself, shrink it back to beginning size
   var sl = snake.length - 1;
   for (i = 1; i < sl; i++)
   {
      if (snake[sl].x == snake[i].x && snake[sl].y == snake[i].y)
      {
         for (i = 2; i < sl; i++)
            snake.shift();
         resetScore();
         
         // play sound
         playSound(sound3);
      } 
   }
   
   // if wrapping allowed, check for that now
   if (doWrap)
   {
      // update snake length
      sl = snake.length - 1;
      // wrap snake across screen
      for (i = sl; i >= 0; i--)
      {
         if (snake[i].x + dim > canvas.width)
            snake[i].x = 0;
         else if (snake[i].x < 0)
            snake[i].x = canvas.width;
         if (snake[i].y + dim > canvas.height)
            snake[i].y = 0;
         else if (snake[i].y < 0)
            snake[i].y = canvas.height;
      }
   }
   // otherwise, check for collision with wall
   else // !doWrap
   {
      // update snake length
      sl = snake.length - 1;
      
      // if the snake hits the edges, reset it
      if (snake[sl].x + dim > canvas.width  ||
          snake[sl].x       < 0             ||
          snake[sl].y + dim > canvas.height ||
          snake[sl].y       < 0)
      {
         resetScore();
         regenSnake();
         
         // play sound
         if (sl > 2)
            playSound(sound3);
      }
   }
}

/********************
 * DRAW ALL OBJECTS *
 ********************/
function drawAll()
{
   // draw the background
   context.fillStyle = '#000000';
   context.fillRect(0, 0, canvas.width, canvas.height);
   
   // draw the square
   context.fillStyle = "#ff0000";
   context.fillRect(ax, ay, dim, dim);

   // draw the snake
   for (i = 0; i < snake.length; i++)
   {
      context.fillStyle = "#00ff00";
      context.fillRect(snake[i].x, snake[i].y, dim, dim);
   }
}

/**************
 * PLAY SOUND *
 **************/
function playSound(sound)
{
   // only play sounds if they're enabled
   if (chkSound.checked)
   {
      // do not play sound while paused
      // (unless it's the 'pause' or 'toggle wrapping' sounds)
      if (!paused          ||
          sound === sound4 || 
          sound === sound6 || 
          sound === sound7)
      {
         // restart sound
         sound.currentTime = 0;
         sound.play();
      }
   }
}

/************************
 * REGENERATE THE APPLE *
 ************************/
function regenApple()
{
   ax = randomize(dim, canvas.width  - dim, dim);
   ay = randomize(dim, canvas.height - dim, dim);
}

/************************
 * REGENERATE THE SNAKE *
 ************************/
function regenSnake()
{
   snake = [];
   var sx = canvas.width / 2;
   var sy = canvas.height / 2;
   snake.unshift({x: sx,          y: sy});
   snake.unshift({x: sx - dx,     y: sy - dy});
   snake.unshift({x: sx - 2 * dx, y: sy - 2 * dy});
}

/***************
 * RESET SCORE *
 ***************/
function resetScore()
{
   // update high score if new
   if (score > hScore)
         hScore = score;
   
   // update recent scores if last score was not zero
   if (score > 0)
      recent = score;
   
   // reset current score
   score = 0
}

/***************************
 * GENERATE RANDOM INTEGER *
 ***************************/
function randomize(minimum, maximum, modulus)
{
   var num = Math.random() * (maximum - minimum) + minimum;
   return parseInt(num / modulus) * modulus;
}

/***********************************
 * GET DOCUMENT OBJECT MODEL BY ID *
 ***********************************/
function domById(id)
{
   return document.getElementById(id);
}
