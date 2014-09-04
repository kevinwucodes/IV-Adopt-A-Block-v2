
function init_page_PacMan()
{
 console.log("init_client_page.js#init_page_PacMan()");
 pacman_layer.addTo(map);	
 navigator.geolocation.getCurrentPosition(function (pos) {map.setView(L.latLng(pos.coords.latitude,pos.coords.longitude), 18);},
 										 function onerror(error) {console.log(error.message);}, 
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
  timer = setInterval(function(){set_position();}, POSITION_TIME_INTERVAL); 
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
 clearInterval(timer); // pause tracking my position 
 
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
 timer = setInterval(function(){set_position();}, POSITION_TIME_INTERVAL); 
 
  $('#menu_resume').attr("id","menu_pause");
  $('#menu_pause').attr("data-icon","minus");
  $('#menu_pause').addClass('ui-icon-minus');
  $('#menu_pause').removeClass('ui-icon-recycle');   
  $('#menu_pause').attr("onclick","db_pause_trip('"+TRIP_ID+"');"); 
  $('#menu_pause').html("pause");     
}





function db_complete_trip_callback ()
{
 // clearInterval(timer); // stop tracking my position but it's already done in the bucket page
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
  timer=false;
  destroyPacman();
 
}



function db_post_image_callback ()
{
 uploading=false; // reset
}

function db_post_image_fail_callback ()
{
 imageElement.parentNode.removeChild(imageElement);
}



function loadSummary(tripId, bucket, comment)
{
 $('#summary').html("TRIP: "+tripId+"<br>BUCKETS: "+bucket+"<br>COMMENT: "+comment);
}







var photo_lat;
var photo_lng;
var uploading = false;
var imageUrl="";
var progressElement; // progress bar of uploaded photos
var imageElement;

function handle_photo(event)
{
 
  if (uploading)
  	{alert('you can upload just one photo per time'); return;}
     // open popup #popupPhoto
    uploading=true; // just one photo at time	
    photo_lat = LAST_POSITION.lat;
    photo_lng = LAST_POSITION.lng;
	// Read files
	var files = event.target.files;

	// Iterate through files
	for (var i = 0; i < files.length; i++) {

		// Ensure it's an image
		if (files[i].type.match(/image.*/)) {

			// Load image
			var reader = new FileReader();
			reader.onload = function (readerEvent) {
				var image = new Image();
				image.onload = function (imageEvent) {
				
				// Add elemnt to page
					imageElement = document.createElement('div');
					imageElement.classList.add('uploading');
					imageElement.innerHTML = '<span class="progress"><span></span></span>';
					$('#show-picture').append(imageElement);					
					progressElement = imageElement.querySelector('span.progress span');
					progressElement.style.width = 0;
					document.querySelector('#show-picture').appendChild(imageElement);
				
					// Resize image					
					
					var MAX_WIDTH = 400;
					var MAX_HEIGHT = 300;
					var tempW = image.width;
					var tempH = image.height; 
			        if (tempW > tempH) 
			          {
			            if (tempW > MAX_WIDTH) 
			             {
			               tempH = tempH*MAX_WIDTH / tempW;
			               tempW = MAX_WIDTH;
			             }
			           } 
			        else 
			          {
			            if (tempH > MAX_HEIGHT) 
			            {
			               tempW = tempW*MAX_HEIGHT / tempH;
			               tempH = MAX_HEIGHT;
			            }
			          }
			 
			        var canvas = document.createElement('canvas');
			        canvas.width = tempW;
			        canvas.height = tempH;
			        var ctx = canvas.getContext("2d");
			        ctx.drawImage(image, 0, 0, tempW, tempH);
			        var imageform = new FormData($('#take-picture'));
					db_post_image(imageform, TRIP_ID, LAST_POSITION, "this is a comment", "hazard");
				}

				image.src = readerEvent.target.result;

			}
			reader.readAsDataURL(files[i]);
		}

	}

	// Clear files
	event.target.value = '';


}