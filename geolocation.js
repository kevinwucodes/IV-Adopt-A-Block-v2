

function set_position()
{  
	 if (navigator.geolocation)
    	{
    	 navigator.geolocation.getCurrentPosition(handle_gps, handleError,
    	                                 {'enableHighAccuracy':true,'timeout':10000,'maximumAge':500});
         } 
   else
   		{ alert("geolocalization not supported");} 
 }
 
 
 
function handleError(error) 
   { 

		// In base all'errore, visualizza il messaggio corrispondente all'utente
	switch(error.code) 
	 {
		case error.PERMISSION_DENIED:
			console.log("geolocalization not allowed");
			//alert("geolocalization not allowed");
			window.clearInterval(timer);
			break;
		case error.POSITION_UNAVAILABLE:
			console.log('POSITION_UNAVAILABLE, I try again');
			break;
		case error.TIMEOUT:
			alert("request geolocalization timeout");
			break;
		case error.UNKNOWN_ERROR:
			alert("geolocalization UNKNOWN_ERROR");
			break;
		default:
			alert("geolocalization UNKNOWN_ERROR");
			break;
	  }
	}
	
function handle_gps(pos)
{
 lat = pos.coords.latitude;
 lng = pos.coords.longitude;
 currentPoint = L.latLng([lat,lng]);
 for (j=0; j<blocks.length; j++)
		    {   
		     //db += JSON.stringify(blocks[j].toGeoJSON());
		     var layer = leafletPip.pointInLayer(currentPoint, L.geoJson(blocks[j].toGeoJSON()), true);
			 if (layer.length) 
			   { 
			     for (m=0; m<vertex[j].length; m++)
			     	{
				     	vertex_json_properties = vertex[j][m].toGeoJSON();
				     	marker_latlng = currentPoint;
				     	vertex_latlng = L.latLng(vertex_json_properties.features[0].geometry.coordinates[1],
				     							 vertex_json_properties.features[0].geometry.coordinates[0]);
				     	
				     	var distance = (marker_latlng.distanceTo(vertex_latlng).toFixed(0));
				     	if (distance < proximity)
				     	 {
				     	  vertex[j][m].setStyle( {fillColor: '#00FF00'} );
				     	  vertex[j][m].setStyle( {color: '#00FF00'} );
				     	  vertex[j].splice(m, 1); // splice modifies the array in place and 
				     	                          // returns an array with removed elements
				     	  if (vertex[j].length==0)
				     	  	{
					     	 blocks[j].setStyle( {fillColor: '#00FF00'} );
					     	 blocks[j].setStyle( {color: '#00FF00'} );
					     	 completed_blocks.push(blocks[j]);
				     	  	}
				     	 }
			     	}
			   }
			}
		  if (lastPosition!=false)
		     {
			  var line_json  = 
			 	    	{
						      type: 'Feature',
						      geometry: 
						         {
						          type: 'LineString',
						          coordinates: [
						                         [lastPosition.lng, lastPosition.lat],
						                         [currentPoint.lng, currentPoint.lat]
						                       ]
						         },
						      properties: 
						         {
							       color: '#5F9EA0',
							       weight: 8,
							       opacity: 0.4,
							       clickable: false
						         }
						  };
			  var line = L.geoJson(line_json, {style: function(feature) { return feature.properties; }});	
			  drawnItems.addLayer(line);
			 }
			lastPosition = currentPoint;
}	





