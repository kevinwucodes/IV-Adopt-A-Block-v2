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
			alert("turn on your GPS service!");
			break;
		case error.POSITION_UNAVAILABLE:
			console.log('POSITION_UNAVAILABLE, I try again');
			break;
		case error.TIMEOUT:
			console.log("geolocalization timeout");
			break;
		case error.UNKNOWN_ERROR:
		    console.log("geolocalization UNKNOWN_ERROR "+error.message);
			break;
		default:
			console.log("geolocalization UNKNOWN_ERROR "+error.message);
			break;
    }
}

function handle_gps(pos)
{
    if (new Date().getTime() - lastPositionTime > POSITION_TIME_INTERVAL)
    {
        lat = pos.coords.latitude;
        lng = pos.coords.longitude;
        console.log("lat:"+lat+" lng:"+lng);
        currentPoint = L.latLng([lat,lng]);
        // if you want to consider just GPS points into Isla Vista
        // delete the 'true' into the IF of the function global.js#add_new_position()
        add_new_position(currentPoint);
    }
}	





