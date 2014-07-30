var blocks=[]; //array of all the blocks
var currentBlockIndex = -1; //blocks[] index of the block clicked

var completed_blocks=[];
var vertex=[]; // array of array.  vertex[j] is an array of all the circles of blocks[j]
var proximity = 16;  // distance between a vertex and user position, to become visited
var lastPosition = false;
var timer;  // timer that checks current user position
var pacman_lines=[]; //dotted line of each block, pacman style [TODO]

var drawnItems; //layer hat owns all the shapes (circles, polygons, markers)
var map; //MapBox map. to be initialized. drawnItems should be added to this map


// COLORS
var BLOCK_COLOR = '#f06eaa';
var BLOCK_STROKE_OPACITY = 0.4;
var BLOCK_FILL_OPACITY = 0.1;

var COVERED_SHAPE_COLOR = '#00FF00';
var USER_PATH_COLOR = '#5F9EA0';
var USER_PATH_OPACITY = 0.4;



function getHTML_block_popup(currentBlockIndex)
{
 return '<fieldset class="clearfix input-pill pill mobile-cols"><input type="text" id="block_name_popup'+currentBlockIndex+'" class="col9" /><button id="add-button'+currentBlockIndex+'" class="col3">Add Name</button></fieldset>';
}
