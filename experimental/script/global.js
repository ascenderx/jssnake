var game       = {};
var cvs        = gel('cvs');
var lblScore   = gel('lbl-score');
var lblHScore  = gel('lbl-hscore');
var tdScore    = gel('td-score');
var tdHScore   = gel('td-hscore');
var tdPaused   = gel('td-paused');
var tdWrapping = gel('td-wrapping');
var FPS        = 60;
var DELAY      = 5;
var MIN_LENGTH = 3;
var POINT_SPEC = 10;
var BLOCK_W    = 20;
var BLOCK_H    = 20;
var GRID_W     = Math.floor(cvs.width  / BLOCK_W);
var GRID_H     = Math.floor(cvs.height / BLOCK_H);
var COLOR_PER  = 20;
var COLORS = [
	'#0f0', // green
	'#70f', // violet
	'#f70', // orange
	'#07f', // cyan
	'#ff0', // yellow
	'#00f', // blue
];