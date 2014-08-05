var pacman_timer;
var destination;
var direction;
var speed = 30; //higher = slower
var walking=false;




var audio_chomp = new Audio("http://danielefani.altervista.org/cleanItUp/CITRIX/pacman_chomp.wav"); 
audio_chomp.addEventListener('ended', function() 
   {
    	this.currentTime = 0;
    	if (walking) 
    		{this.play();}
   }, false);

function movePacMan(destinationPoint)
{
    audio_chomp.play();
    destination=destinationPoint;
	if (!pacman)
	   {
		pacman = L.marker([destination.lat, destination.lng],  {
		        icon: L.divIcon({
		            className: 'pacman',
		            iconSize: [33, 30],
		            "iconAnchor": [15, 15],
		        })
		    });
		pacman.addTo(map);
	   }
	else{
	    direction = movementDirection(pacman.getLatLng(), destinationPoint);
		if (direction=="up")  
			 {
			  $('.pacman').addClass('up');
			 }
		 else if (direction=="down")  
			 {
			  $('.pacman').addClass('down');
			 }
		 else if (direction=="left")  
			 {
			  $('.pacman').addClass('left');
			 }
		 else if (direction=="right")  
			 {
			  $('.pacman').addClass('right');
			 }	
	    pacman_timer = setInterval(function(){walk();}, speed);
	    }
		 						
}


function walk()
{
    walking=true;
  	if (direction=="up")
		{ pacman.setLatLng(L.latLng([pacman.getLatLng().lat + 0.00001, pacman.getLatLng().lng])); 
		  if (pacman.getLatLng().lat >= destination.lat)
		  	{stop_walking();}	
		}
	else if (direction=="down")
		{ pacman.setLatLng(L.latLng([pacman.getLatLng().lat - 0.00001, pacman.getLatLng().lng])); 
		  if (pacman.getLatLng().lat <= destination.lat)
		  	{stop_walking();}
		}
	else if (direction=="right")
		{ pacman.setLatLng(L.latLng([pacman.getLatLng().lat, pacman.getLatLng().lng+ 0.00001])); 
		  if (pacman.getLatLng().lng >= destination.lng)
		  	{stop_walking();}			
		}
	else if (direction=="left")
		{ pacman.setLatLng(L.latLng([pacman.getLatLng().lat, pacman.getLatLng().lng- 0.00001])); 
		  if (pacman.getLatLng().lng <= destination.lng)
		  	{stop_walking();}			
		} 
}

function stop_walking()
{
      walking=false;
 clearInterval(pacman_timer);
 if (direction=="up")  
		 {
		  $('.pacman').removeClass('up');
		  $('.pacman').css('background-position', '0px 33px');
		 }
	 else if (direction=="down")  
		 {
		  $('.pacman').removeClass('down');
		  $('.pacman').css('background-position', '0px 95px');
		 }
	 else if (direction=="left")  
		 {
		  $('.pacman').removeClass('left');
		  $('.pacman').css('background-position', '0px 60px');
		 }
	 else if (direction=="right")  
		 {
		  $('.pacman').removeClass('right');
		  $('.pacman').css('background-position', '0px 0px');
		 }	

}
