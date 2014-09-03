/**

even if I stay always in the SAME page, I can logically consider it as 3 different pages:


===== PAGE MAP (or real-time-page)
just show the map and the blocks. I will see volunteers here


===== PAGE EDITOR
I load the maptile of pacman, so I can draw polygons (blocks)
around the streets, fitting pacman paths



*/







function init_page_editor()
{	
 console.log("init_admin_pages.js#init_page_editor().");
 try {map.removeLayer(pacman_layer);} catch(layer_not_present){/*ignore*/}
 try {map.removeControl(drawControl);} //remove the old drawControl with markers
 catch(control_not_present){/*ignore*/}
   
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
 console.log("init_admin_pages.js#init_page_realTime().");
 try {map.removeLayer(pacman_layer);} catch(layer_not_present){/*ignore*/}
 try {map.removeControl(drawControl);} //remove every draw control present
 catch(control_not_present){/*ignore*/}
 $( "#left-panel" ).panel( "close" ); 
}




function init_page_dailyReport ()
{
 $("body").pagecontainer("change", "#daily-report-page", { transition:'pop' });
 result = db_get_all_trips();
 tbody="";
 for (j=0; j<result.trips.length; j++)
 	{
 	 trip = result.trips[j];
 	 tbody+="<tr>";
     tbody+="  <td>"+result.firstname+" "+result.lastname+"</td>"; 	
	 tbody+="  <td>"+new Date(trip.created)+"</td>";
	 tbody+="  <td>"+new Date(trip.completed)+"</td>";
	 tbody+="  <td>"+trip.buckets+"</td>";
	 tbody+="  <td>"+trip.blocks+"</td>";
	 tbody+="</tr>";
 	} 	
    
 $('#table_daily_tbody').html(tbody);
 $('#table_daily').DataTable();

}
