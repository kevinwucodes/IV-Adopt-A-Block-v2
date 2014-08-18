// ====== VARIABLES ======
var currentBlockIndex = -1; //blocks[] index of the block clicked
var proximity = 15;  // min distance required for a vertex from the user position, to become visited
var lastPosition = false;
var POSITION_TIME_INTERVAL = 1000; // each how many milliseconds the current position is updated
var SEGMENT_DISTANCE=20;
var POINT_DISTANCE=5; // distance between 2 points of the same segment
var TRIP_ID; // got by db when a user sign in

// ====== ARRAYS ======
var blocks=[]; //array of all the blocks
var covered_points=[]; // has all the GPS points of a segment covered by a volunteer
                       // a segment is a line with distance = SEGMENT_DISTANCE
                       // in a segment, pacman will keep the same direction
var completed_blocks=[];
var vertex=[]; // array of array.  vertex[j] is an array of all the circles of blocks[j]

// ====== LAYERS ======
var mapTile; // mapTile used.  L.tileLayer('http://{s}.tile.stamen.com/watercolor/{z}/{x}/{y}.jpg'
var drawControl; // controls to draw polygons and put markers
var drawnPath; 
var drawnBlocks; //layer hat owns all the shapes (circles, polygons, markers)
var drawnVertexes; 
var drawnMarkers;

var pacman_layer; //MapTie with yellow dotted streets

// ====== OBJECETS ======
var map; //MapBox map. to be initialized. drawnItems should be added to this map
var timer;  // timer that checks current user position 
var pacman;
 
 
// ====== SHAPE ATTRIBUTES ======
var BLOCK_STROKE_COLOR = 'rgb(45,114,176)';
var BLOCK_STROKE_OPACITY = 1;
var BLOCK_STROKE_WEIGHT = 7;
var BLOCK_FILL_COLOR = '#0033FF';
var BLOCK_FILL_OPACITY = 0;

var VERTEX_STROKE_COLOR = '#FF9900';
var VERTEX_STROKE_OPACITY = 0.8;
var VERTEX_STROKE_WEIGHT = 4;
var VERTEX_FILL_COLOR = '#FF9900';
var VERTEX_FILL_OPACITY = 0.8;
var VERTEX_RADIUS = "4";


var COVERED_BLOCK_STROKE_COLOR = 'rgb(52,123,79)';
var COVERED_BLOCK_FILL_COLOR = 'rgb(72,173,110	)';

var USER_PATH_COLOR = '#a79c9c';
var USER_PATH_OPACITY = 1;
var USER_PATH_WEIGHT = 19;







function add_new_position(point)
{
 // is it inside any block?
	 	  var isInside= false;
	 	  for (j=0; j<blocks.length; j++)
		    {   
		     var layer = leafletPip.pointInLayer(point, L.geoJson(blocks[j].toGeoJSON()), true);
			 if (layer.length) 
			   {
			    isInside=true;
			    checkVertexesCovered( point, j);
			   }
			}
			if (isInside)  // if it's false, it's the first relevation 
			     {  
			      addCoveredPath(point);
			      lastPosition = point; 
			      db_save_currentPosition(point);  // save it only if it's inside a block
			     }
}




function initialize_map()
{
 map = L.mapbox.map('map', null,{minZoom: 15,maxZoom: 19}).setView([34.4141859, -119.859201], 18);
 mapTile = L.tileLayer('http://{s}.tile.stamen.com/watercolor/{z}/{x}/{y}.jpg', {
  attribution: 'Map tiles by <a href="http://stamen.com">Stamen</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>'
}).addTo(map);
 mapTile.setZIndex(0);
 pacman_layer = L.mapbox.tileLayer('de-lac.OSMBright');  //I'll add it only in the right page
 pacman_layer.setZIndex(1);

  drawnPath = new L.FeatureGroup(); // Initialise the FeatureGroup to store editable layers   
  drawnBlocks = new L.FeatureGroup();
  drawnVertexes = new L.FeatureGroup();
  drawnMarkers = new L.FeatureGroup();

 readAndLoadBlocks(); //reads blocks from db
 
 drawnPath.addTo(map).setZIndex(0); // Initialise the FeatureGroup to store editable layers 
 drawnBlocks.addTo(map).setZIndex(1);   
 drawnVertexes.addTo(map).setZIndex(2);   
 drawnMarkers.addTo(map).setZIndex(3);



// when a shape has been just created
 map.on('draw:created', function(e) 
 	{
 	  if (e.layerType == 'marker') 
 	  	{
 	  	 // I HAVE PUT A MARKER ON THE MAP
 	  	 drawnMarkers.addLayer(e.layer); // add the block to the featureGroup
	 	  var marker = 	e.layer;
	 	  add_new_position(marker.getLatLng());			      	 	 
 	  	}
 	  else
 	    {// I HAVE DRAWN A POLYGON ON THE MAP
          drawnBlocks.addLayer(e.layer); // add the block to the featureGroup
	 	  currentBlock = e.layer;
	 	  blocks.push(currentBlock);
	 	  currentBlockIndex = blocks.length-1;
	 	  vertex[currentBlockIndex] = [];
	 	  var circles_to_draw = currentBlock.getLatLngs();
	 	  for (i=0; i<circles_to_draw.length; i++)
		 	  { 
		 	    var point = circles_to_draw[i];
		 	    addVertex(point.lng, point.lat);
			   }
		  
	      currentBlock.on('click', function(e)
	      						 {
	      						  currentBlockIndex = currentBlockIndex;
	      						 });
	      
	      currentBlock.bindPopup(getHTML_block_popup());
	    
	      currentBlock.openPopup();
	      $('#map').on('click', '#add-button'+p, function(e) 
	         {
			  message = L.DomUtil.get('block_name_popup'+currentBlockIndex).value;
	          blocks[currentBlockIndex].bindLabel(message); 
	          blocks[currentBlockIndex].closePopup();
	         });
	       
	      currentBlock.on('mouseover', function(e){e.target.setStyle( {fillOpacity: 0.6} ); });   		 
	      currentBlock.on('mouseout', function(e){e.target.setStyle( {fillOpacity: 0} ); }); 
	      alert(polygonToJSON(circles_to_draw, ''));   	   
	     }
    });
}




function checkVertexesCovered(marker_latlng, blockIndex)
{
 for (m=0; m<vertex[j].length; m++)
	{
	 vertex_json_properties = vertex[j][m].toGeoJSON();
	 vertex_latlng = L.latLng(vertex_json_properties.features[0].geometry.coordinates[1],			     							  vertex_json_properties.features[0].geometry.coordinates[0]
	 						 );
				     	
	 var distance = (marker_latlng.distanceTo(vertex_latlng));
	 if (distance < proximity)
	   {
		 vertex[j][m].setStyle( {fillColor: COVERED_BLOCK_FILL_COLOR} );
		 vertex[j][m].setStyle( {color: COVERED_BLOCK_FILL_COLOR} );
		 vertex[j][m].setStyle( {fillOpacity: 0.8} );				     	  
		 vertex[j].splice(m, 1); // remove the vertex covered
		 m--;
		 if (vertex[j].length==0)
		   { // all the vertexwa have been covered
			 blocks[j].setStyle( {fillColor: COVERED_BLOCK_FILL_COLOR} );
			 blocks[j].setStyle( {color: COVERED_BLOCK_STROKE_COLOR} );
			 blocks[j].setStyle( {fillOpacity: 0.7} );					     	 
			 completed_blocks.push(blocks[j]);
			 alert('compliments, you have completed '+completed_blocks.length+' blocks');
			}
	   }
	}
}






/**
* gives the code to put into a block's popup to store its name.
* currentBlockIndex   should be already set with the right blocks[] index.
*/
function getHTML_block_popup()
{
 return '<fieldset class="clearfix input-pill pill mobile-cols"><input type="text" id="block_name_popup'+currentBlockIndex+'" class="col9" /><button id="add-button'+currentBlockIndex+'" class="col3">Add Name</button></fieldset>';
}