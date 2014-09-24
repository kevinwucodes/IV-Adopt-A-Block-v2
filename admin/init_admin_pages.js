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
var currentCompletedBlock;

var timer_realtime_position;



// =======================================
//============= INIT PAGES   =============
// =======================================

function init_page_editor()
{	
 /*restore all the blocks to the not-cleaned color*/
  for (i=0; i<completed_blocks.length; i++)
     {
       setNotCleanedBlock(id_blocks.indexOf(completed_blocks[i])); 
       i--;  // since setNotCleanedBlock remove one element each time
     }

 console.log("init_admin_pages.js#init_page_editor().");
 try{clearInterval(timer_realtime_position); timer_realtime_position=false;}catch(timer_not_present){/*ignore*/}
 try {map.removeLayer(pacman_layer);}        catch(layer_not_present){/*ignore*/}
 try {map.removeControl(drawControl);}       catch(control_not_present){/*ignore*/}
 try {currentVolunteersLayer.setGeoJSON(
  				 {"type": "FeatureCollection",
  				  "features": []
  				 }
  				)} catch(layer_not_present){/*ignore*/}
 try {volunteerTripLayer.clearLayers();}     catch(layer_not_present){/*ignore*/}
    currentCompletedBlock=0;
 $("#trip_statistics_buckets").text("-");
 $("#trip_statistics_blocks").text("-");
 $("#trip_statistics_time").text("-"); 
 // fix the zoom at 18! so, with a big PacMan and a thick line,  it's easyer cover all the points    
 map.setView(map.getCenter(),18);
 
 // center map to current gps position
 /* 
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
*/

   
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








/*look also at #db_get_all_current_trips_callback()    */
function init_page_Map()
{
 if (!map)
   {initialize_map();}
 if (!timer_realtime_position)
     //update volunteers' position each 10sec
  {timer_realtime_position = setInterval(function(){init_page_Map();}, 10000);} 
 console.log("init_admin_pages.js#init_page_Map().");
  /*restore all the blocks to the not-cleaned color*/
  for (i=0; i<completed_blocks.length; i++)
     {
       setNotCleanedBlock(id_blocks.indexOf(completed_blocks[i]));   
       i--; // since setNotCleanedBlock remove one element each time
     }
 try {map.removeLayer(pacman_layer);}    catch(layer_not_present){/*ignore*/}
 try {map.removeControl(drawControl);}   catch(layer_not_present){/*ignore*/}
 try {volunteerTripLayer.clearLayers();} catch(layer_not_present){/*ignore*/}
 try {currentVolunteersLayer.setGeoJSON(
  				 {"type": "FeatureCollection",
  				  "features": []
  				 }
  				)} catch(layer_not_present){/*ignore*/}
  
  if(!currentVolunteersLayer)
     { 
      currentVolunteersLayer =  L.mapbox.featureLayer();
      currentVolunteersLayer.addTo(map);
     }   
 $("#trip_statistics_buckets").text("-");
 $("#trip_statistics_blocks").text("-");
 $("#trip_statistics_time").text("-");   
 currentCompletedBlock=0;     
 db_get_all_current_trips();
  // db_get_all_images();
 $( "#left-panel" ).panel( "close" ); 
}







function init_page_dailyReport ()
{
  try{clearInterval(timer_realtime_position); timer_realtime_position=false;}catch(timer_not_present){/*ignore*/}
 try {map.removeLayer(pacman_layer);}    catch(layer_not_present){/*ignore*/}
 try {map.removeControl(drawControl);}   catch(layer_not_present){/*ignore*/}
 try {volunteerTripLayer.clearLayers();} catch(layer_not_present){/*ignore*/}
 try {currentVolunteersLayer.clearLayers();} catch(layer_not_present){/*ignore*/}
  
  if(!volunteerTripLayer)
     { 
      volunteerTripLayer = L.mapbox.featureLayer(); 
      volunteerTripLayer.addTo(map);
     } 
 // I must change page now, before build the table, otherwise the search will not work
 $('body').pagecontainer('change', '#daily_report_page', {transition: 'slide'});
 $( "#left-panel" ).panel( "close" );
 from =1000000000001;
 to = new Date().getTime();
 db_get_all_trips(from, to);
}








// =======================================
//============= DB CALLsBACK =============
// =======================================


var tableTools; // contains the button to export the table in pdf, excel, ...

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
		 // last column has a button to show the trip on the map_page
		 tbody+="  <td> "+
		        "      <a href=\"#\" onclick=\"db_get_waypoints('"+trip.tripID+"');\"> "+
		        "         <img src='http://tidesandcurrents.noaa.gov/images/map.png' border='0'/>"
		        "      </a>"+
		        "  </td>";
		 tbody+="</tr>";
 	   }
 	} 	
    
 $('#table_daily_tbody').html(tbody);
 $('#table_daily').DataTable();
 if (!tableTools)
   {
	  tableTools = new $.fn.dataTable.TableTools( $('#table_daily'), 
	      {
			 "sSwfPath": "http://cdn.datatables.net/tabletools/2.2.2/swf/copy_csv_xls_pdf.swf",
	         "aButtons": 
	           [  /* export just the rows filtered by the search field.  http://datatables.net/docs/DataTables/1.9.4/#%24 */
		         { "sExtends": "copy", "mColumns": "visible", "oSelectorOpts":  { filter: 'applied', page: "all" } },
		         { "sExtends": "csv", "mColumns": "visible", "oSelectorOpts":   { filter: 'applied', page: "all" } },
		         { "sExtends": "xls", "mColumns": "visible", "oSelectorOpts":   { filter: 'applied', page: "all" } },
		         { "sExtends": "pdf", "mColumns": "visible", "oSelectorOpts":   { filter: 'applied', page: "all" } },
		         { "sExtends": "print", "mColumns": "visible", "oSelectorOpts": { filter: 'applied', page: "all" } }                                 
		       ]
	       });
	 $( tableTools.fnContainer() ).insertAfter('#table_daily');
   }
 // $('body').pagecontainer('change', '#daily_report_page', {transition: 'slide'});
 // I can't change page here, I must change page before build the table, otherwise the Search will not work
}




function db_get_all_current_trips_callback (result)
{
   console.log("init_admin_pages.js#db_get_all_current_trips_callback().");
  for (i=0; i< result.data.length; i++)
  	{
	  tripID = result.data[i].trips[0].tripID;
	  db_get_last_waypoint(tripID);
  	}
  $('body').pagecontainer('change', '#map-page', {transition: 'slide',}); 
}



/*
* put a marker to show the current position of a volunteer 	
**/
function db_get_last_waypoint_callback (result)
{
 if (!result.trips.points || result.trips.points.length ==0)
 	{return;} //just started, not yet points available
 name = result.firstname;
 name += ' '+result.lastname;
 lat = result.trips.points[result.trips.points.length-1].lat;
 lng = result.trips.points[result.trips.points.length-1].long;
 var marker_json  = {
					    type: "Feature",
					    geometry: 
					      {
					       type: "Point",
					       coordinates: [lng, lat]
					      },
					    properties: 
					      { 
					        title: name,
	                        'marker-color' : "#A52A2A"
					      }
					}; 
 
  	 markers_json = currentVolunteersLayer.getGeoJSON();
  	 markers_json.features.push(marker_json);
  	currentVolunteersLayer.setGeoJSON(markers_json); 
  	
  

  //############# map.fitBounds(currentVolunteersLayer.getBounds());  #############
  currentCompletedBlock += result.trips.blocks;
  //############# $("#trip_statistics_blocks").text(currentCompletedBlock); ###############
  // color green the completed blocks
  if (result.trips.validatedBlocks)
      {
	    for (i=0; i<result.trips.validatedBlocks.length; i++)
	     {
		   blockIndex =  id_blocks.indexOf(result.trips.validatedBlocks[i]);
	       setCleanedBlock(blockIndex);  
	     }
	  }
}






/**
 draws a line to show a trip. a green marker points the start,
 a red marker points the end of the trip.
 a mouse:hover on the markers will show the time of start/end
*/

function db_get_waypoints_callback (result)
{ 
  if (!result.trips.points || result.trips.points.length ==0)
  	{console.log('[db_get_waypoints_callback] no points to show');return;}
 var latlng_coordinates = [];
 for (i=0; i<result.trips.points.length; i++)
   { latlng_coordinates.push([result.trips.points[i].lat, result.trips.points[i].long]); } //get all the points
 
  // create the line
  tripPath = L.polyline(latlng_coordinates,
                    {
					   color: '#B00000',
					   weight: 5,
					   opacity: COVERED_BLOCK_FILL_OPACITY,
					   clickable: false,
					   smoothFactor:1
					  }
				    );	
  volunteerTripLayer.addLayer(tripPath);			    
  map.fitBounds(latlng_coordinates);	 
     
 // create the start marker				    
 var start_marker_json  = {
					    type: "Feature",
					    geometry: 
					      {
					       type: "Point",
					       coordinates: [ latlng_coordinates[0][1], latlng_coordinates[0][0] ] 
					      },
					    properties: 
					      { 
					        title: new Date(result.trips.created).customFormat( "#MMM#/#DD#/#YY# - #hh#:#mm#" ),
	                        'marker-color' : '#009900'
					      }
					};
  
   // create the end marker				    
 var end_marker_json  = {
					    type: "Feature",
					    geometry: 
					      {
					       type: "Point",
					       coordinates: [ latlng_coordinates[latlng_coordinates.length-1][1], latlng_coordinates[latlng_coordinates.length-1][0] ] 
					      },
					    properties: 
					      { 
					        title: new Date(result.trips.completed).customFormat( "#MMM#/#DD#/#YY# - #hh#:#mm#" ),
	                        'marker-color' : '#cc0000'                     
					      }
					};
  volunteerTripLayer.setGeoJSON([start_marker_json,end_marker_json]);
  volunteerTripLayer.addLayer(tripPath);
				    
				    
	num_buckets = result.trips.buckets;
	num_blocks = result.trips.blocks;
	// works only if time < 24h
	time = result.trips.completed - result.trips.created; // diff in milliseconds
	time =  Math.floor(time/1000); // in seconds
	h = Math.floor(time/60/60); //how many hours
	m = Math.floor((time - (h*60))/60); // how many minutes
	s =  (time - (h*60*60) - (m*60));

    $("#trip_statistics_buckets").text(num_buckets);
    $("#trip_statistics_blocks").text(num_blocks);
    $("#trip_statistics_time").text(h+":"+m+":"+s);        

    if (result.trips.validatedBlocks)
      {
	    for (i=0; i<result.trips.validatedBlocks.length; i++)
	     {
		   blockIndex =  id_blocks.indexOf(result.trips.validatedBlocks[i]);
	       setCleanedBlock(blockIndex);  
	     }
	  }
    
	$('body').pagecontainer('change', '#map-page', {transition: 'slide',}); 
	 map.invalidateSize(); 
}