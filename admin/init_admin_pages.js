/**

even if I logically consider several different pages, there is just one page with the map


===== PAGE MAP
just show the map and the blocks. I will see volunteers here


===== PAGE EDITOR
I load the maptile of pacman, so I can draw polygons (blocks)
around the streets, fitting pacman paths



*/



var currentVolunteersLayer; // markers of volunteer that are cleaning now
var volunteerTripLayer; // trip choosen clicking on the table of page2



function init_page_editor()
{	
 console.log("init_admin_pages.js#init_page_editor().");
 try {map.removeLayer(pacman_layer);} catch(layer_not_present){/*ignore*/}
  //remove the old drawControl with markers
 try {map.removeControl(drawControl);}catch(control_not_present){/*ignore*/}
 try {currentVolunteersLayer.clear(); map.removeLayer(currentVolunteersLayer);}
      catch(layer_not_present){/*ignore*/}
 try {volunteerTripLayer.clear(); map.removeLayer(volunteerTripLayer);}
      catch(layer_not_present){/*ignore*/}
 
 navigator.geolocation.getCurrentPosition(function (pos)
                                             {
                                              map.setView(L.latLng(pos.coords.latitude,
                                                                   pos.coords.longitude),
                                                                   18
                                                                  );
                                              },
                                           function onerror(error)
                                              {
                                               console.log(error.message);
                                               if (error.code == error.PERMISSION_DENIED)
                                                {
                                                 console.log("geolocalization not allowed");
                                                 alert("turn on your GPS service!");
                                                }
                                               },
                                           {'enableHighAccuracy':true,'timeout':10000,'maximumAge':500}
                                          );
 // fix the zoom at 18! so, with a big PacMan and a thick line,  it's easyer cover all the points
   
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
 map.invalidateSize(); // changing page could give problems so I redraw the map to fit the right size.
 $( "#left-panel" ).panel( "close" ); 
}








/*look also at #db_get_all_current_trips_callback()    */
function init_page_Map()
{
 console.log("init_admin_pages.js#init_page_Map().");
 try {map.removeLayer(pacman_layer);} catch(layer_not_present){/*ignore*/}
 //remove every draw control present
 try {map.removeControl(drawControl);} catch(layer_not_present){/*ignore*/}
 try {volunteerTripLayer.clear(); map.removeLayer(volunteerTripLayer);}
      catch(layer_not_present){/*ignore*/}
 map.invalidateSize(); // changing page could give problems so I redraw the map to fit the right size.
 $( "#left-panel" ).panel( "close" ); 
 //################ db_get_all_current_trips(); ####################################
}




function init_page_dailyReport ()
{
 $( "#left-panel" ).panel( "close" );
 from =1000000000001;
 to = new Date().getTime();
 db_get_all_trips(from, to);
}




function init_page_VolunteerReport()
{
 $( "#left-panel" ).panel( "close" );
 db_get_all_volunteer_trips(name, surname);
}





// =========== DB CALLsBACK ================


function db_get_all_volunteer_trips_callback(result)
{ 
 var tbody="";
 for (j=0; j<result.trips.length; j++)
 	{
 	 var trip = result.trips[j];
 	 tbody+="<tr>";
	 tbody+="  <td>"+new Date(trip.created)+"</td>";
	 tbody+="  <td>"+new Date(trip.completed)+"</td>";
	 tbody+="  <td>"+trip.buckets+"</td>";
	 tbody+="  <td>"+trip.blocks+"</td>";
	 tbody+="</tr>";
 	} 	
    
 $('#table_vol_tbody').html(tbody);
 $('#table_vol').DataTable();
  $('body').pagecontainer('change', '#vol_report_page', {transition: 'slide',});
}




function db_get_all_trips_callback (result)
{
 console.log("db_get_all_trips_callback()");
 var tbody="";
 for (j=0; j<result.data.length; j++)
 	{
 	 var trips_of_volunteer = result.data[j].trips;
 	 for (k=0; k<trips_of_volunteer.length; k++)
 	   {
 	     trip = trips_of_volunteer[k];
	 	 tbody+="<tr>";
	     tbody+="  <td>"+result.data[j].firstname+" "+result.data[j].lastname+"</td>"; 	
		 tbody+="  <td>"+new Date(trip.created).customFormat( "#MMM#/#DD#/#YYYY# <br> #hh#:#mm#" )+"</td>";
		 tbody+="  <td>"+new Date(trip.completed).customFormat( "#MMM#/#DD#/#YYYY# <br> #hh#:#mm#" )+"</td>";
		 tbody+="  <td>"+trip.buckets+"</td>";
		 tbody+="  <td>"+trip.blocks+"</td>";
		 tbody+="</tr>";
 	   }
 	} 	
    
 $('#table_daily_tbody').html(tbody);
 $('#table_daily').DataTable();
 $('body').pagecontainer('change', '#daily_report_page', {transition: 'slide',});
}




function db_get_all_current_trips_callback (result)
{
  currentVolunteersLayer = new L.FeatureGroup();
  $('body').pagecontainer('change', '#map-page', {transition: 'slide',}); 
}






function db_get_waypoints_callback (result)
{
 try {currentVolunteersLayer.clear(); map.removeLayer();}
      catch(layer_not_present){/*ignore*/}
 volunteerTripLayer = new L.FeatureGroup(); 
 
 var latlng_coordinates = [];
 for (i=0; i<results.trips.points.length; i++)
   { latlng_coordinates.push({lat:results.trips.points[i].lat, lng:results.trips.points[i].long}); }
 
 
 var tripJson  = {
					   type: "Feature",
					   geometry: 
					   	 {
						 type: "PolyLine",
						 coordinates: latlng_coordinates
						 },
						properties: 
						 {
							color: COVERED_BLOCK_STROKE_COLOR,
							weight: USER_PATH_WEIGHT,
							opacity: BLOCK_FILL_COLOR,
							clickable: false
						 }
    				   };
	var shape = L.mapbox.featureLayer();
	shape = L.geoJson(tripJson, {style: function(feature) { return feature.properties; }});
	volunteerTripLayer.addLayer(shape);
	$('body').pagecontainer('change', '#map-page', {transition: 'slide',}); 
}