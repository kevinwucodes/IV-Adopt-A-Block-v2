
function init_page_PacMan()
{
 console.log("init_client_page.js#init_page_PacMan().");
 map.setZoom('18');
 pacman_layer.addTo(map);	
 map.setView(map.getCenter(), 18); // fix the zoom at 18! so, with a big PacMan 
     							   //and a thick line,  it's easyer cover all the points
  
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
  /* =========================*/
  
  document.querySelector("#take-picture").addEventListener
                ('change', function(event)
  					         {handle_photo(event);}
  				);
 }  









function startTracking ()
{
 name = $('#volname').val();
 surname = $('#volsurname').val();
 type = $('#voltype').val();
 if (!name || !surname)
   {return;}
 alert('start tracking..but still not saving');
 timer = setInterval(function(){set_position();}, POSITION_TIME_INTERVAL); // start tracking my position
  $('#popupSignin').popup('close');
  $('#popupSignin').popup('close'); // bug... 2 times are required  
  
  
  $.ajax(
  {
	  type: "POST",
	  url: "https://iv-adopt-a-block-v2.jit.su/users",
	  data: '{ "firstname":"'+name+'","lastname":"'+surname+'","tripCategory":"'+type+'"}',
	  headers: {
	           "Content-Type": "application/json",
	           "Accept-Version": "~1"
	          },		
	  dataType: 'json',          	
	  success: function(response)
	                 {
	                  tripId = response.UUID;
	                  alert("tripId: "+tripId);
	                  },
	  error: function(response)
	                 {alert(JSON.stringify(response)); }
  });
  
  
}
















var photo_lat;
var photo_lng;
var uploading = false;
var imageUrl="";


function handle_photo(event)
{
 
  if (uploading)
  	{alert('you can upload just one photo per time'); return;}
     // open popup #popupPhoto
    uploading=true; // just one photo at time	
    photo_lat = currentPosition.lat;
    photo_lng = currentPosition.lng;
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
					var imageElement = document.createElement('div');
					imageElement.classList.add('uploading');
					imageElement.innerHTML = '<span class="progress"><span></span></span>';
					var progressElement = imageElement.querySelector('span.progress span');
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
					
					// Upload image
					var xhr = new XMLHttpRequest();
					if (xhr.upload) 
					  {
                    	// Update progress
						xhr.upload.addEventListener('progress', function(event) 
						   {
							var percent = parseInt(event.loaded / event.total * 100);
							progressElement.style.width = percent+'%';
						   }, false);

						// File uploaded / failed
						xhr.onreadystatechange = function(event) 
						   { 
							if (xhr.readyState == 4) 
							   {
								if (xhr.status == 200) 
								 {
								  var imageUrl=xhr.responseText;
								  var json='{ "markers" : [{"lat": "'+photo_lat+'", "lng":"'+photo_lng+'", "id_user" : "'+fbid+'", "photoUrl" : "'+imageUrl+'" }]}';
                                  $.post(   serverAddress+"/server/server_set.php",
                                  	{function: "save_markers", markers: json }).done
                                  		(
                                  		 function(resp)
                                  		  { 
                                  		   jresp = JSON.parse(resp);
                                  		   uploading=false; // reset
                                  		   var new_markers = jresp.markers;
                                  		   for (k=0; k<new_markers.length; k++)
	                                  		  { 
	                                  		   if (new_markers[k].response == "ok")
	                                  		    {
		                                  		   alert('marker saved on the map');
		                                  		   add_marker(new_markers[k].lat, new_markers[k].lang, 
		                                  		   			  new_markers[k].photoUrl, new_markers[k].index);
		                                  		   imageElement.classList.remove('uploading');
												   imageElement.classList.add('uploaded');
												   imageElement.style.backgroundImage = 'url("'+serverAddress+imageUrl+'")';
												   imageUrl=""; // reset
												 }
												 else {alert('something wrong '+resp);}	
											   }
										  }
										);
						            }
						       else 
						       	{ imageElement.parentNode.removeChild(imageElement); }
							  }
						}

						// Start upload
						xhr.open('post', 'http://danielefani.altervista.org/cleanItUp/server/loadPhoto.php', true);
						xhr.send(canvas.toDataURL('images/jpeg', 0.7));  // 0.7 is the jpg quality

					}

				}

				image.src = readerEvent.target.result;

			}
			reader.readAsDataURL(files[i]);
		}

	}

	// Clear files
	event.target.value = '';


}