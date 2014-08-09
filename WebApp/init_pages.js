/**

even if I stay always in the SAME page, I can logically consider it as 3 different pages:


===== PAGE MAP (or real-time)
just show the map and the blocks. I will see volunteers here


===== PAGE EDITOR
I load the maptile of pacman, so I can draw polygons (blocks)
around the streets, fitting pacman paths


===== PAGE START  (or pacman)
I start the timer relevating my GPS position. If it's inside a block,
I put pacman. I can simulate my GPS position also manually drawing markers on the map.
Again, only positions inside blocks are considered.


*/







function init_page_editor()
{	
   console.log("init_pages.js#init_page_editor().");
  try {map.removeLayer(pacman_layer);} catch(layer_not_present){/*ignore*/}
 try {map.removeControl(drawControl);} //remove the old drawControl with markers
 catch(control_not_present){/*ignore*/}
 clearInterval(timer);
   
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
					color: BLOCK_STROKE_COLOR,
					weight: BLOCK_STROKE_WEIGHT,
					opacity: BLOCK_STROKE_OPACITY,
					fill: true,
					fillColor: BLOCK_FILL_COLOR, //same as color by default
					fillOpacity: BLOCK_FILL_OPACITY,
					clickable: true
				 }
             },
        circle: false, // Turns off this drawing tool
        marker: false      }  
  };

 drawControl = new L.Control.Draw(options);
 map.addControl(drawControl); 
 pacman_layer.addTo(map); 
 
 
 $( "#left-panel" ).panel( "close" ); 
}









function init_page_realTime()
{
    console.log("init_pages.js#init_page_realTime().");
 try {map.removeLayer(pacman_layer);} catch(layer_not_present){/*ignore*/}
 try {map.removeControl(drawControl);} //remove every draw control present
 catch(control_not_present){/*ignore*/}
 $( "#left-panel" ).panel( "close" ); 
  clearInterval(timer);
}







function init_page_PacMan()
{
 console.log("init_pages.js#init_page_PacMan().");
 map.setZoom('18');
 pacman_layer.addTo(map);	
 $( "#left-panel" ).panel( "close" );
 map.setView(map.getCenter(), 18); // fix the zoom at 18! so, with a big PacMan 
     							   //and a thick line,  it's easyer cover all the points

 try {map.removeControl(drawControl);} //remove the old drawControl with polygons
 catch(control_not_present){/*ignore*/} 
 
 /* TODO probably there is a way to disable polygons without creating a new drawControl*/
 
 /* ==========TESTING ONLY ==========*/
 // add a control to add just markers, to simulate volunteer walks
 var options = 
  {
    position: 'topright',
    draw: 
      { // https://github.com/Leaflet/Leaflet.draw/blob/master/README.md
        polyline: false,
        polygon:  false,
        circle: false,
        rectangle : false,
        marker: true      }  
  };
 drawControl = new L.Control.Draw(options);
 map.addControl(drawControl); 
  /* =========================*/
  
 timer = setInterval(function(){set_position();}, POSITION_TIME_INTERVAL); // start tracking my position
 }  

