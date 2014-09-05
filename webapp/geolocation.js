

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
 set_gps_signal_icon(pos.coords.accuracy);
 lat = pos.coords.latitude;
 lng = pos.coords.longitude;
 currentPoint = L.latLng([lat,lng]);
 // if you want to consider just GPS points into Isla Vista
 // delete the 'true' into the IF of the function global.js#add_new_position()
 add_new_position(currentPoint);
			 
}	


function set_gps_signal_icon(accuracy)
{
 if (accuracy <= 0)
  {
   $('#gps-signal').css('color', 'red');    
   $('#gps-signal').html('no-gps');     	  
  }
 else if (accuracy <= HIGH_ACCURACY)
  {
   $('#gps-signal').css('color', 'green');    
   $('#gps-signal').html('h-gps');
  }  
 else
  {
   $('#gps-signal').css('color', 'rgb(241,142,11)');            
   $('#gps-signal').html('low-gps');
  }
}





