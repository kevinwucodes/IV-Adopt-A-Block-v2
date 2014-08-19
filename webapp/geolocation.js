

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
			clearInterval(timer);
			break;
		case error.POSITION_UNAVAILABLE:
			console.log('POSITION_UNAVAILABLE, I try again');
			break;
		case error.TIMEOUT:
			console.log("geolocalization timeout");
			break;
		case error.UNKNOWN_ERROR:
		    console.log("geolocalization UNKNOWN_ERROR");
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
 add_new_position(currentPoint);
			 
}	





