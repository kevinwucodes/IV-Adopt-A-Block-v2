/**
* reads blocks, draws them on the map as polygons, and adds them at blocks[] array.
* for each vertex of the polygons, a circle it's created
*/
function readAndLoadBlocks()
{
polygons_json = db_read_blocks();


for (p=0; p<polygons_json.polygons.length; p++)
  {
   poly_coord = polygons_json.polygons[p].polygon.coordinates;
   vertex[p] = [];
   currentBlockIndex=p;
   var latlng_coordinates=[]; //contains the points of the polygon
   for (c=0; c<poly_coord.length; c++)
	   	{ 
	   	 var point = L.latLng(poly_coord[c].lng, poly_coord[c].lat);
	   	 latlng_coordinates.push([poly_coord[c].lng, poly_coord[c].lat]);
	   	 addVertex(point.lat, point.lng);
	   	}
	   	
	addBlock(latlng_coordinates, polygons_json.polygons[p].polygon.name);
    
    // if (polygons_json.polygons[p].polygon.pacman.length > 0)
	//    {  addPacManLine(polygons_json.polygons[currentBlockIndex].polygon.pacman);	 }
		  
       

    timer = setInterval(function(){set_position();}, POSITION_TIME_INTERVAL);
  }
  

}



/**
* adds a circle on the map, and at the vertex[] array	
*/
function addVertex(lat, lng)
{
	   	 
	   	 var circle_json  = {
					      type: 'Feature',
					      geometry: 
					         {
					          type: 'Point',
					          coordinates: [lat, lng]
					         },
					      properties: 
					         {
					           radius:VERTEX_RADIUS,
						       stroke: false,
						       color: VERTEX_STROKE_COLOR,
						       weight: VERTEX_STROKE_WEIGHT,
						       opacity: VERTEX_STROKE_OPACITY,
						       fill: true,
						       fillColor: VERTEX_FILL_COLOR, //same as color by default
						       fillOpacity: VERTEX_FILL_OPACITY,
						       clickable: false
					         }
					  };
		var circle = L.geoJson(circle_json, 
						      {pointToLayer: function(feature, latlng) 
						      				    {return L.circleMarker(latlng, {radius: feature.properties.radius})},
						       style: function(feature) { return feature.properties; }});			  
		 drawnVertexes.addLayer(circle);
	     vertex[currentBlockIndex].push(circle);


}



/**
* adds a polygon on the map, and at the blocks[] array.
* polygons have binded popup with their name	
*/
function addBlock(latlng_coordinates, name)
{
 var shape_json  = {
					   type: "Feature",
					   geometry: 
					   	 {
						 type: "Polygon",
						 coordinates: [latlng_coordinates]
						 },
						properties: 
						 {
						    stroke: true,
							color: BLOCK_STROKE_COLOR,
							weight: BLOCK_STROKE_WEIGHT,
							opacity: BLOCK_STROKE_OPACITY,
							fill: true,
							fillColor: BLOCK_FILL_COLOR, //same as color by default
							fillOpacity: BLOCK_FILL_OPACITY,
							clickable: true
						 }
    				   };
	var shape = L.mapbox.featureLayer();
	shape = L.geoJson(shape_json, {style: function(feature) { return feature.properties; }});
    drawnBlocks.addLayer(shape);
    shape.bindLabel(name);
    shape.bindPopup(getHTML_block_popup());

    blocks.push(shape);
    
    //when click on a polygon, save it as currentBlock
    shape.on('click', function(e)
	      						 {
	      						  for (b=0; b<blocks.length;b++)
	      						   {if (blocks[b]==e.target)
		      						 {currentBlockIndex = b;}
	      						   }
	      						 });
	      						 
	      						 
	  shape.on('mouseover', function(e){e.target.setStyle( {fillOpacity: 0.6} ); });   		 
	  shape.on('mouseout', function(e){e.target.setStyle( {fillOpacity: 0} ); });    						     						 
	      						 
	  //once clicked on a polygon, its popup automatically opens up.
	  //anyway I can't refer directly to the content of its popup because it doesn't exist yet    		
	  //so I refer to #map and then #add-buttonX			 
	 $('#map').on('click', '#add-button'+currentBlockIndex, function(e) 
	         {
			  message = L.DomUtil.get('block_name_popup'+currentBlockIndex).value;
	          blocks[currentBlockIndex].bindLabel(message); 
	          blocks[currentBlockIndex].closePopup();
	         });     						 
}


/**
* adds a dotted line pacman-style the follows coordinates specified within the polygon
* [TODO], it's still a draft
*/
function addPacManLine(pacman)
{
 var pacman_points=[];
	         for (pp=0; pp < pacman.length; pp++)
		         {  pacman_points.push([pacman[pp].lng, pacman[pp].lat]); }
		     var pacman_json  = 
				 	    	{
							      type: 'Feature',
							      geometry: 
							         {
							          type: 'LineString',
							          coordinates: pacman_points
							         },
							      properties: 
							         {
								       color: '#FFCC00',
								       weight: 8,
								       opacity: 1,
								       clickable: false,
								       dashArray: [1, 30] 
							         }
							  };
			 pacman_line = L.geoJson(pacman_json, {style: function(feature) { return feature.properties; }});
			 pacman_lines.push(pacman_line);
			 drawnPath.addLayer(pacman_line);
}




/**
* draws a line between the current user's GPS position and the last one
*/
function addCoveredPath(current_lng, current_lat)
{
 movePacMan(L.latLng(current_lat,current_lng));
 if(!lastPosition) {return;} //it's the first position
 var line_json  = 
			 	    	{
						      type: 'Feature',
						      geometry: 
						         {
						          type: 'LineString',
						          coordinates: [
						                         [lastPosition.lng, lastPosition.lat],
						                         [current_lng, current_lat]
						                       ]
						         },
						      properties: 
						         {
							       color: USER_PATH_COLOR,
							       weight: USER_PATH_WEIGHT,
							       opacity: USER_PATH_OPACITY,
							       clickable: false,
							       smoothFactor:20
						         }
						  };
  var line = L.geoJson(line_json, {style: function(feature) { return feature.properties; }});	
  drawnPath.addLayer(line);
  drawnPath.bringToBack();
}


//alert( JSON.stringify((poly.geometry.coordinates)));
