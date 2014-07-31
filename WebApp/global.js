// ====== VARIABLES ======
var currentBlockIndex = -1; //blocks[] index of the block clicked
var proximity = 16;  // distance between a vertex and user position, to become visited
var lastPosition = false;

// ====== ARRAYS ======
var blocks=[]; //array of all the blocks
var pacman_lines=[]; //dotted line of each block, pacman style [TODO]
var completed_blocks=[];
var vertex=[]; // array of array.  vertex[j] is an array of all the circles of blocks[j]

// ====== OBJECTS ======
var drawnItems; //layer hat owns all the shapes (circles, polygons, markers)
var map; //MapBox map. to be initialized. drawnItems should be added to this map
var timer;  // timer that checks current user position


// ====== SHAPE ATTRIBUTES ======
var BLOCK_COLOR = '#f06eaa';
var BLOCK_STROKE_OPACITY = 0.4;
var BLOCK_FILL_OPACITY = 0.1;

var COVERED_SHAPE_COLOR = '#00FF00';
var USER_PATH_COLOR = '#5F9EA0';
var USER_PATH_OPACITY = 0.4;

var VERTEX_RADIUS = "5";






function initialize_map()
{
 map = L.mapbox.map('map', 'examples.map-i86nkdio').setView([34.4141859, -119.859201], 18);
 drawnItems = new L.FeatureGroup(); // Initialise the FeatureGroup to store editable layers
 map.addLayer(drawnItems);
 readAndLoadBlocks(); //reads blocks from db

 // add the Leaf tool to draw shapes on the map
 var options = 
  {
    position: 'topright',
    draw: 
      { // https://github.com/Leaflet/Leaflet.draw/blob/master/README.md
        polyline: false,
        polygon: 
        	{
	            allowIntersection: false, // Restricts shapes to simple polygons
	            drawError: {
	                color: '#bada55', // Color the shape will turn when intersects
	                showArea:true,
	                message: 'you can\'t draw that!' // Message when intersect
                           },
		        shapeOptions: 
		         {
		            stroke: true,
					color: BLOCK_COLOR,
					weight: 4,
					opacity: BLOCK_STROKE_OPACITY,
					fill: true,
					fillColor: null, //same as color by default
					fillOpacity: BLOCK_FILL_OPACITY,
					clickable: true
				 }
             },
        circle: false, // Turns off this drawing tool
        marker: true      }  
  };

var drawControl = new L.Control.Draw(options);
map.addControl(drawControl);



// when a shape has been just created
 map.on('draw:created', function(e) 
 	{
 	  drawnItems.addLayer(e.layer); // add the block to the featureGroup
 	  if (e.layerType == 'marker') 
 	  	{
 	  	 // I HAVE PUT A MARKER ON THE MAP
	 	  var marker = 	e.layer;
	 	  var db = "";
	 	  // is it inside any block?
	 	  for (j=0; j<blocks.length; j++)
		    {   
		     //db += JSON.stringify(blocks[j].toGeoJSON());
		     var layer = leafletPip.pointInLayer(marker.getLatLng(), L.geoJson(blocks[j].toGeoJSON()), true);
			 if (layer.length) 
			   { 	 	  
			     for (m=0; m<vertex[j].length; m++)
			     	{
				     	vertex_json_properties = vertex[j][m].toGeoJSON();
				     	marker_latlng = marker.getLatLng();
				     	vertex_latlng = L.latLng(vertex_json_properties.features[0].geometry.coordinates[1],
				     							 vertex_json_properties.features[0].geometry.coordinates[0]);
				     	
				     	var distance = (marker_latlng.distanceTo(vertex_latlng).toFixed(0));
				     	if (distance < proximity)
				     	 {
				     	  vertex[j][m].setStyle( {fillColor: COVERED_SHAPE_COLOR} );
				     	  vertex[j][m].setStyle( {color: COVERED_SHAPE_COLOR} );
				     	  vertex[j].splice(m, 1); // remove the vertex covered
				     	  if (vertex[j].length==0)
				     	  	{ // all the vertex have been covered
					     	 blocks[j].setStyle( {fillColor: COVERED_SHAPE_COLOR} );
					     	 blocks[j].setStyle( {color: COVERED_SHAPE_COLOR} );
					     	 completed_blocks.push(blocks[j]);
					     	 alert('compliments, you have completed '+completed_blocks.length+' blocks');
				     	  	}
				     	 }
			     	}
			   }
			}
		  if (lastPosition!=false)  // if it's false, it's the first relevation 
		     {  addCoveredPath(marker.getLatLng().lng, marker.getLatLng().lat);  }
			lastPosition = marker.getLatLng();
			//alert((db));
 	  	}
 	  else
 	    {// I HAVE DRAWN A POLYGON ON THE MAP

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
	     }
    });
}




/**
* gives the code to put into a block's popup to store its name.
* currentBlockIndex   should be already set with the right blocks[] index.
*/
function getHTML_block_popup()
{
 return '<fieldset class="clearfix input-pill pill mobile-cols"><input type="text" id="block_name_popup'+currentBlockIndex+'" class="col9" /><button id="add-button'+currentBlockIndex+'" class="col3">Add Name</button></fieldset>';
}
