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


function init_page_PacMan()
{
 console.log("init_client_page.js#init_page_PacMan()");
 pacman_layer.addTo(map);	
 // I check gps position to center the map and show to the user the current the accuracy
 // I will destroy this watch once I start a new trip (look at the SIGN IN popup)
 watchGPS =  navigator.geolocation.watchPosition
    (//onsuccess
     function (pos)
      {
       set_gps_signal_icon(pos.coords.accuracy);
       map.setView(L.latLng(pos.coords.latitude,pos.coords.longitude), 18);
      },
       //onerror
     function (error)
      {
       console.log(error.message);
       if (error.code == error.PERMISSION_DENIED)
        {
         console.log("geolocalization not allowed");
         alert(GPS_NOT_ALLOWED);
        }
      },
     {'enableHighAccuracy':true,'timeout':10000,'maximumAge':500}
    );
 // fix the zoom at 18! so, with a big PacMan and a thick line,  it's easyer cover all the points
 map.touchZoom.disable();
 map.doubleClickZoom.disable();
 map.scrollWheelZoom.disable();     							   
  
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
  /* ===============================*/
  
  document.querySelector("#take-picture").addEventListener
                ('change', function(event)
  					         {handle_photo(event);}
  				);
}  





// ===========================================================================================
// ============== CALLBACK DB FUNCTIONS ==================================
// ===========================================================================================

function db_start_trip_callback (name, surname, type)
{
  // start tracking my position
  start_tracking(); 
  $('#popupSignin').popup('close');
  $('#popupSignin').popup('close'); // BUG... 2 times are required  i don't know why
  
  $('#menu_start').attr("href", "#");  
  $('#menu_start').attr("id", "menu_pause"); 
  
  $('#menu_pause').attr('data-rel', "");  
  $('#menu_pause').html("pause"); 
  $('#menu_pause').attr("onclick", "db_pause_trip('"+TRIP_ID+"');");    
  $('#menu_pause').attr('data-icon', "minus");
  $('#menu_pause').addClass('ui-icon-minus')
  $('#menu_pause').removeClass('ui-icon-navigation');
    
  $('#menu_stop').removeClass('ui-disabled');   // enable stop
}



function db_pause_trip_callback ()
{
  stop_tracking(); // pause tracking my position
 
  $('#menu_pause').attr("id","menu_resume");
  $('#menu_resume').attr("data-icon","recycle");
  $('#menu_resume').addClass('ui-icon-recycle')
  $('#menu_resume').removeClass('ui-icon-minus');  
  $('#menu_resume').attr("onclick","db_resume_trip('"+TRIP_ID+"');"); 
  $('#menu_resume').html("resume");      
}



function db_resume_trip_callback ()
{
 // resume tracking my position
  start_tracking();
 
  $('#menu_resume').attr("id","menu_pause");
  $('#menu_pause').attr("data-icon","minus");
  $('#menu_pause').addClass('ui-icon-minus');
  $('#menu_pause').removeClass('ui-icon-recycle');   
  $('#menu_pause').attr("onclick","db_pause_trip('"+TRIP_ID+"');"); 
  $('#menu_pause').html("pause");     
}





function db_complete_trip_callback ()
{
 // stop_tracking(); // stop tracking my position but it's already done in the bucket page
 $("body").pagecontainer("change", "#main-page", { transition:'pop' });
 
 $('#menu_resume').attr("id","menu_start");
 $('#menu_pause').attr("id","menu_start");

 $('#menu_camera').removeClass('ui-disabled');
 
 $('#menu_start').removeClass('ui-icon-recycle');  
 $('#menu_start').removeClass('ui-icon-minus');  
 $('#menu_start').removeClass('ui-disabled');   // enable start 
 $('#menu_start').addClass('ui-icon-navigation');
 $('#menu_start').attr("href","#popupSignin");
 $('#menu_start').attr("onclick"," "); 
 $('#menu_start').attr('data-rel', "popup"); 
 $('#menu_start').html("start");  
 
 // reset variables
  TRIP_ID="";
  covered_points=[];
  completed_blocks=[];
  LAST_POSITION = false;
  watchGPS=false;
  destroyPacman();
 
}



function db_post_image_callback ()
{
 uploading=false; // reset
 $('#hazardPhoto').attr('src', '');
 progressElement.css("width", "0"); //not useful, I set 0 for each upload
 $('#popupPhoto').popup('close');
}



function loadSummary(tripId, bucket, comment, blocks)
{
 stop_tracking(); /* stop tracking my position */
 $('#summary_tripid').text(tripId);
 $('#summary_bucket').text(bucket);
 $('#summary_block').text(blocks);  
 $('#summary_comment').text(comment);   
}






// ===========================================================================================
// ============== PHOTO UPLOAD ==================================
// ===========================================================================================

var uploading = false;
var progressElement; // progress bar of uploaded photos

function handle_photo(event)
{
  if (uploading)
  	{alert(ALREADY_UPLOADING); return;}
  if (!TRIP_ID)
     {
      alert(NO_TRIP_FOUND);
      db_post_image_callback();      
	  return;   	     
     }  	
  if (!LAST_POSITION)
     {
      alert(NO_POSITION_FOUND);
      db_post_image_callback();
	  return;   
     }  	


	// Read files
	var file = event.target.files[0];
	// Ensure it's an image
	if (file.type.match(/image.*/)) 
	     {
	       $('#popupPhoto').popup('open');
	      uploading=true; // just one photo at time	
	      photo_lat = LAST_POSITION.lat;
	      photo_lng = LAST_POSITION.lng;
	      progressElement = $('#progressElement'); 
	      // Add progress bar to the page				
		  progressElement.css("width", "0");

	     
          // prepare the formData to POST to the server
	      var formData = new FormData();
		  formData.append("tripID", TRIP_ID);                                        
          formData.append("point", '{"lat": '+photo_lat+', "long": '+photo_lng+', "epoch": '+new Date().getTime()+'}');
		  formData.append("imageType", "JPG");
		  formData.append("type", "hazard");
		  formData.append("comment", "this is a comment");			        			        
		  formData.append("blob", file);				        
		  db_post_image(formData);
	     
         var reader = new FileReader();
         reader.onload = function (e) 
           { $('#hazardPhoto').attr('src', e.target.result); }

        reader.readAsDataURL(file);
       }
    else {alert(WRONG_FILE+' '+file.type);}       
}




	     
	 