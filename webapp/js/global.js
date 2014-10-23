/*
   Copyright 2014 Daniele Fanì (daniele.fani@unicam.it)

   This file is part of IV-Adopt-A-Block-v2 software.
   Its source code is available at https://github.com/ginxwar/IV-Adopt-A-Block-v2

    IV-Adopt-A-Block-v2 is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    IV-Adopt-A-Block-v2 is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with Nome-Programma.  If not, see <http://www.gnu.org/licenses/>.
*/



// ====== VARIABLES ======
//$.support.cors = true; // tell $.ajax to load cross-domain pages.  
//$.mobile.allowCrossDomainPages = true;
 
var currentBlockIndex = -1; //blocks[] index of the block clicked
var proximity = 15;  // min distance in meters required for a vertex from the user position, to become visited
var LAST_POSITION = false;
var POSITION_TIME_INTERVAL = 3000; // how often (in milliseconds) the current position is updated
var SEGMENT_DISTANCE=20;  // pacman start moving after SEGMENT_DISTANCE meters have been cleaned
var POINT_DISTANCE=5; // distance between 2 points of the same segment
var TRIP_ID; // got by db when a user sign in
var USERNAME;
var USERSURNAME; 
var USERTYPE;
var HIGH_ACCURACY = 10; // min accuracy (in meters) to be considered high
var MONGO_SERVER_URL = "https://iv-adopt-a-block-v2.jit.su" ;
 
// ====== ARRAYS ======
var blocks=[]; //array of all the blocks
var id_blocks=[]; //array of IDs of all the blocks
var covered_points=[]; /* has all the GPS points of a segment covered by a volunteer
                        * a segment is a line with distance = SEGMENT_DISTANCE
                        * in a segment, pacman will keep the same direction 
                        */
var completed_blocks=[]; // array of id of completed blocks
var vertex=[]; // array of array.  vertex[j] is an array of all the circles of blocks[j]

// ====== LAYERS ======
var mapTile; // mapTile used.  L.tileLayer('http://{s}.tile.stamen.com/watercolor/{z}/{x}/{y}.jpg'
var drawControl; // controls to draw polygons and put markers
var drawnPath; 
var drawnBlocks; //layer hat owns all the shapes (circles, polygons, markers)
var drawnVertexes; 
var drawnMarkers;
var drawnRoadLabels; // layer with the labels of the roads and lands

var pacman_layer; //MapTie with yellow dotted streets

// ====== OBJECETS ======
var map; //MapBox map. to be initialized. drawnItems should be added to this map
var watchGPS;  // timer that checks current user position 
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
var VERTEX_RADIUS = 4;


var COVERED_BLOCK_STROKE_COLOR = 'rgb(52,123,79)';
var COVERED_BLOCK_FILL_COLOR = 'rgb(72,173,110	)';
var COVERED_BLOCK_FILL_OPACITY = 0.6;

var USER_PATH_COLOR = '#a79c9c';
var USER_PATH_OPACITY = 1;
var USER_PATH_WEIGHT = 19;



function loading()
{
 $.mobile.loading( "show", {
            text: "",
            textVisible: false,
            //theme : $.mobile.loader.prototype.options.theme,
            textonly: false,
            html: ""
           });
 black_panel_style = $("#blackPanel").attr("style");
 black_panel_style = black_panel_style.replace("z-index:-1;", "z-index:2000;");
 $("#blackPanel").attr("style",black_panel_style); 
}

function stopLoading()
{ 
 $.mobile.loading( "hide" ); 
 black_panel_style = $("#blackPanel").attr("style");
 black_panel_style = black_panel_style.replace("z-index:2000;", "z-index:-1;");
 $("#blackPanel").attr("style",black_panel_style); 
}



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
			// if you want to consider just points into blocks,
            // delete the 'true' below
			if (true || isInside) 
			     {  
			      addCoveredPath(point);
			      LAST_POSITION = point; 
			      db_post_waypoint(TRIP_ID, point);  // save it only if it's inside a block
			      console.log("add_new_position "+point.lat+" "+point.lng);
			     }
}




function initialize_map()
{
 map = L.mapbox.map('map', null,{minZoom: 15,maxZoom: 19, trackResize: true}).setView([34.4141859, -119.859201], 18);
 mapTile = L.tileLayer('http://{s}.tile.stamen.com/watercolor/{z}/{x}/{y}.jpg', {
  attribution: 'Map tiles by <a href="http://stamen.com">Stamen</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>'
}).addTo(map);
 mapTile.setZIndex(0);
 pacman_layer = L.mapbox.tileLayer('de-lac.IslaVista'); // or de-lac.VillaRosa; I'll add it later only in the right page
 pacman_layer.setZIndex(1);

  drawnPath = new L.FeatureGroup(); // Initialise the FeatureGroup to store editable layers   
  drawnBlocks = new L.FeatureGroup();
  drawnVertexes = new L.FeatureGroup();
  drawnMarkers = new L.FeatureGroup();
  drawnRoadLabels = L.mapbox.tileLayer('de-lac.IslaVistaLabels');
  
 readAndLoadBlocks(); //reads blocks from db
 
 drawnPath.addTo(map).setZIndex(0); // Initialise the FeatureGroup to store editable layers 
 drawnBlocks.addTo(map).setZIndex(1);   
 drawnVertexes.addTo(map).setZIndex(2);   
 drawnMarkers.addTo(map).setZIndex(3);
 drawnRoadLabels.addTo(map).setZIndex(300);



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
	     
	     // BIND THE POPUP WITH AN INPUT-TEXT TO INSERT THE NAME FOR THAT BLOCK 
	     // currentBlock.bindPopup(getHTML_block_popup()); 
	     /*
	      currentBlock.openPopup();
	      $('#map').on('click', '#add-button'+p, function(e) 
	         {
			  message = L.DomUtil.get('block_name_popup'+currentBlockIndex).value;
	          blocks[currentBlockIndex].bindLabel(message); 
	          blocks[currentBlockIndex].closePopup();
	         });
	     */
	      currentBlock.on('mouseover', function(e){e.target.setStyle( {fillOpacity: COVERED_BLOCK_FILL_OPACITY} ); });   		 
	      currentBlock.on('mouseout', function(e){e.target.setStyle( {fillOpacity: 0} ); }); 
	      alert(polygonToJSON(circles_to_draw, ''));   	   
	     }
    });
}




function checkVertexesCovered(marker_latlng, blockIndex)
{
 for (m=0; m<vertex[blockIndex].length; m++)
	{
	 vertex_json_properties = vertex[blockIndex][m].toGeoJSON();
	 vertex_latlng = L.latLng(vertex_json_properties.features[0].geometry.coordinates[1],			     							  vertex_json_properties.features[0].geometry.coordinates[0]
	 						 );
				     	
	 var distance = (marker_latlng.distanceTo(vertex_latlng));
	 if (distance < proximity)
	   {
		 vertex[blockIndex][m].setStyle( {fillColor: COVERED_BLOCK_FILL_COLOR} );
		 vertex[blockIndex][m].setStyle( {color: COVERED_BLOCK_FILL_COLOR} );
		 vertex[blockIndex][m].setStyle( {fillOpacity: 0.8} );				     	  
		 vertex[blockIndex].splice(m, 1); // remove the vertex covered
		 m--;
		 if (vertex[blockIndex].length==0)
		   { // all the vertexes have been covered
			 setCleanedBlock(blockIndex);
			 db_cleaned_block(TRIP_ID, id_blocks[blockIndex]);
			 console.log('compliments, you have completed '+completed_blocks.length+' blocks');
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