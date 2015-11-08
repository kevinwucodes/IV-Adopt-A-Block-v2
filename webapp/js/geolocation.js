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


var lastPositionTime = 0;
var GPS_ACCURACY = -1;  // <1 no gps, 0 low gps, +1 high gps


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
			console.log(GPS_POSITION_NOT_AVAILABLE);
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
 set_accuracy(pos.coords.accuracy);
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


function set_gps_signal_icon()
{
 if (GPS_ACCURACY < 0)
  {
   $('#gps-signal').css('color', 'red');    
   $('#gps-signal').html('no-gps');     	  
  }
 else if (GPS_ACCURACY > 0)
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



/*
   medium=0  low<0   high>0	
*/
function set_accuracy(accuracy)
{
 if (accuracy <= 0)
  {
   GPS_ACCURACY=-1;    	  
  }
 else if (accuracy <= HIGH_ACCURACY)
  {
   GPS_ACCURACY=1;
  }  
 else
  {
   GPS_ACCURACY=0;
  }
  set_gps_signal_icon();
}





