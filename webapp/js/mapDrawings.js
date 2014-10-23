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

/**
 ======  ARE ALL THE GPS POINTS CONSIDERED?  ====================================

well... for the vertexes and blocks coverage yes.
For pacman movements no. 

The behaviour below is implemented in #addCoveredPath().

Pacman movements are asynch. It walks for segments, it doesn't consider ALL the relevated points.
A segmen is long #SEGMENT_DISTANCE. Only when I've reached that distance,
pacman starts walking upon that segment.
To smooth the zig-zag movements, a segment is not made by all the relevated points.
I consider just points far #POINT_DISTANCE among eachother.
 
Example: 
global var SEGMENT_DISTANCE=20;
global var POINT_DISTANCE=5;
relevated points:   0 2 3 4 6 7 8 9 11 14 15 18 20 22 23 

global var covered_points =  0 6 11 18 22.  Once reached 22, pacman starts walking upone segment[0]

when the first and last point added to #covered_points are far more than SEGMENT_DISTANCE,
I clone it in #segment_to_cover so I don't have concurrent problems.
    - #covered_points is cleared and can accept others GPS positions;
    - #segment_to_cover is passed to pacman, that will dequeue all its positions

In this way I can keep pushing elements even if pacman is reading the old positions.



======= I WANT TO USE ANOTHER GUY INSTEAD OF PACMAN ==============================
If we want to use another buddy instead of pacman, implement another "pacman-like" file,
be careful at the CSS and sprites positioning. Then

   -) replace #addSegmentToBeCoveredByPacman(segment_to_cover) inside the function #addCoveredPath(), 
passing the array of points to follow #segment_to_cover.

  -)  replace #createPacman(current_point) inside the function #addCoveredPath().



*/















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
	   	
	addBlock(latlng_coordinates, polygons_json.polygons[p].polygon.name, polygons_json.polygons[p].polygon.id);
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
						      				    {return L.circleMarker(latlng, circle_json.properties)}
						      });			  
		 drawnVertexes.addLayer(circle);
	     vertex[currentBlockIndex].push(circle);


}



/**
* adds a polygon on the map, and at the blocks[] array.
* polygons have binded popup with their name	
*/
function addBlock(latlng_coordinates, name, block_id)
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
    //shape.bindPopup(getHTML_block_popup());

    blocks.push(shape);
    id_blocks.push(block_id);
    
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





function addCoveredPath(current_point)
{
  if(!LAST_POSITION) 
  	{//it's the first position, create pacman and the line
  	 covered_points.push(current_point);
  	 createPacman(current_point);
  	}
  else
  {	 
    if(covered_points.length==0 ||  // i am starting a new segment
       covered_points[covered_points.length-1].distanceTo(current_point).toFixed(0) > POINT_DISTANCE ||
       covered_points[0].distanceTo(current_point).toFixed(0) > SEGMENT_DISTANCE 
      )
        {covered_points.push(current_point);}
     
	if(covered_points[0].distanceTo(current_point).toFixed(0) > SEGMENT_DISTANCE)
	    { //start animating pacman and the line
	     var segment_to_cover=(covered_points.splice(0)); //copy the array
	     covered_point=[]; //clear it to get future points
	     addSegmentToBeCoveredByPacman(segment_to_cover);
		}
   }
}


/**
* color a cleand block of green, and add its index
* to completed_blocks[]
*/
function  setCleanedBlock(blockIndex)
{
 if (completed_blocks.indexOf(id_blocks[blockIndex]) >= 0)
  {return; /*block already set cleaned*/}
 else
  { 
	blocks[blockIndex].setStyle( {fillColor: COVERED_BLOCK_FILL_COLOR} );
	blocks[blockIndex].setStyle( {color: COVERED_BLOCK_STROKE_COLOR} );
	blocks[blockIndex].setStyle( {fillOpacity: 0.7} );					     	 
	completed_blocks.push(id_blocks[blockIndex]); 
  } 
}

/**
* color a  block of not-cleaned color, and remove its index
* from completed_blocks[]
*/
function  setNotCleanedBlock(blockIndex)
{
 blocks[blockIndex].setStyle( {fillColor: BLOCK_FILL_COLOR} );
 blocks[blockIndex].setStyle( {color: BLOCK_STROKE_COLOR} );
 blocks[blockIndex].setStyle( {fillOpacity: BLOCK_FILL_OPACITY} );					     	 
 completed_blocks.splice( completed_blocks.indexOf(id_blocks[blockIndex]), 1);

}



//alert( JSON.stringify((poly.geometry.coordinates)));