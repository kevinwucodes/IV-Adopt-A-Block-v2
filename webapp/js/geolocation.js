var lastPositionTime = 0;



function start_tracking() 
{
    if (navigator.geolocation)
    {
        watchGPS =  navigator.geolocation.watchPosition(handle_gps, handleError,
                                                        {'enableHighAccuracy':true,'timeout':5000,'maximumAge':500});
    }
    else
    { alert("geolocalization not supported");}
}


function stop_tracking()
{
    navigator.geolocation.clearWatch(watchGPS);
}
 
 
 
function handleError(error)
{
    
    // In base all'errore, visualizza il messaggio corrispondente all'utente
	switch(error.code)
    {
		case error.PERMISSION_DENIED:
			console.log("geolocalization not allowed");
			alert(GPS_NOT_ALLOWED);
			break;
		case error.POSITION_UNAVAILABLE:
			console.log(GPS_NOT_AVAILABLE);
			break;
		case error.TIMEOUT:
			console.log(GPS_TIMEOUT);
			break;
		case error.UNKNOWN_ERROR:
		    console.log(GPS_UNK_ERR+' '+error.message);
			break;
		default:
			console.log(GPS_UNK_ERR+' '+error.message);
			break;
    }
}
	
function handle_gps(pos)
{
 set_gps_signal_icon(pos.coords.accuracy);
 if (new Date().getTime() - lastPositionTime > POSITION_TIME_INTERVAL)
   {
	 lat = pos.coords.latitude;
	 lng = pos.coords.longitude;
	 currentPoint = L.latLng([lat,lng]);
	 // if you want to consider just GPS points into Isla Vista
	 // delete the 'true' into the IF of the function global.js#add_new_position()
	 add_new_position(currentPoint);
    }
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





