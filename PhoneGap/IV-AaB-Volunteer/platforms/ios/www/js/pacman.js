/**
*  ========== HOW DOES IT WALK? =====================================
*  the first method to be invoked is #createPacman(). It puts pacman on the map, and create its trail.
*  To make it move, use the method #addSegmentToBeCoveredByPacman(); Adding an array of positions
*  will make pacman move toward them, from the first position to the last. In the meanwhile I can
*  add more segments to cover calling #addSegmentToBeCoveredByPacman(). As soon as pacman will finish
*  a segment, will start walking upone another one.
*
*  To avoid continuous changes of directions, the animation (left,right,up or down) is chosen
*  considering the last point of a segment using #getMainDirection()
*/






var pacman_timer;   // timer that makes move pacman until #currentSegment[0]
var icon_direction; // direction of the image, toward the last point of the #currentSegment
var movement_direction=[];  //[{up,down} , {left,right}] direction toward #currentSegment[0]
var speed = 30; //higher = slower
var walking=false;   // current state
var segments_to_walk = []; // array of segments covered by the volunteer, but not yet by pacman
var currentSegment;
var trail;  //trail (polyline) left by pacman, that cover yellow dots

var audio_chomp; //works on mobile only if it's added at the home screen as webapp


/**
*/


function destroyPacman()
{
 try
  {
   map.removeLayer(pacman);
   map.removeLayer(trail);
  }
 catch (e) {/*if not present, do nothing*/}
 trail=false;
 pacman=false;
 audio_chomp.release();
 audio_chomp=false;
 walking=false;
 segments_to_walk = [];
 movement_direction=[];
 currentSegment=false;
}




function createPacman(point)
{
    walking=false;
	pacman = L.marker([point.lat, point.lng],  {
	            clickable: false,
		        icon: L.divIcon({
		            className: 'pacman',
		            iconSize: [33, 30],
		            "iconAnchor": [15, 15],
		        })
		    });
	pacman.addTo(map);
    map.setView(pacman.getLatLng()); 	
	createLine(point);
    
    audio_chomp= new Media('http://danielefani.altervista.org/cleanItUp/CITRIX/webapp/media/pacman_chomp.wav',
                           mediaSuccess,
                           function (err) { console.log("playAudio():Audio Error: " + err); }
                          );
    audio_chomp.play(/*{ playAudioWhenScreenIsLocked : true }*/);
    audio_chomp.setVolume(0.5);
}

function mediaSuccess()
{
 // loop
 audio_chomp.seekTo(0);
 if (walking)
      {audio_chomp.play(/*{ playAudioWhenScreenIsLocked : true }*/);}
}
		
		
/**
* While pacman walks, I can queue other segments, so as it ends walking, starts another segment.
*/		
function addSegmentToBeCoveredByPacman(segment_to_cover)
{
 segments_to_walk.push(segment_to_cover);
 if (!walking)
  {walk();}
}
	    
	    
	    

/**
* walk along the whole #currentSegment. When finished,
* check if there are others segments to cover in #segments_to_walk
*/
function walk()
{
  audio_chomp.play();
  if (segments_to_walk.length==0)
  	{ stop_walking(); }
  else
   {
    walking=true;    
    currentSegment = segments_to_walk.splice(0, 1)[0];  // pop the first segment
    map.setView(currentSegment[currentSegment.length-1]); 
    //walk toward the last point of this segment
    icon_direction = getMainDirection(pacman.getLatLng(), currentSegment[currentSegment.length-1]); 
    movement_direction = getMovementDirection(pacman.getLatLng(), currentSegment[0]);  //[0] can be where I am now  
	if (icon_direction=="up")  
	 { $('.pacman').addClass('up');}
	else if (icon_direction=="down")  
	 { $('.pacman').addClass('down'); }
	else if (icon_direction=="left")  
	 { $('.pacman').addClass('left'); }
	else if (icon_direction=="right")  
	 { $('.pacman').addClass('right'); }	
	pacman_timer = setInterval(function(){changePosition();}, speed);
   }
}



/**
* walk toward each position in #currentSegment
*/
function changePosition()
{ 
  	if (movement_direction[0]=="up")
		{ pacman.setLatLng(L.latLng([pacman.getLatLng().lat + 0.00001, pacman.getLatLng().lng])); 
		  if (pacman.getLatLng().lat >= currentSegment[0].lat)
		  	{ movement_direction[0]="";  }	
		}
	else if (movement_direction[0]=="down")
		{ pacman.setLatLng(L.latLng([pacman.getLatLng().lat - 0.00001, pacman.getLatLng().lng])); 
		  if (pacman.getLatLng().lat <= currentSegment[0].lat)
		  	{ movement_direction[0]="";  }	
		}
	if (movement_direction[1]=="right")
		{ pacman.setLatLng(L.latLng([pacman.getLatLng().lat, pacman.getLatLng().lng+ 0.00001])); 
		  if (pacman.getLatLng().lng >= currentSegment[0].lng)
		  	{ movement_direction[1]="";  }		
		}
	else if (movement_direction[1]=="left")
		{ pacman.setLatLng(L.latLng([pacman.getLatLng().lat, pacman.getLatLng().lng- 0.00001])); 
		  if (pacman.getLatLng().lng <= currentSegment[0].lng)
		  	{ movement_direction[1]="";  }		
		} 
	trail.addLatLng(pacman.getLatLng());
	
	if (movement_direction[0]==movement_direction[1])
	     {
	      currentSegment.splice(0, 1); //I have reached this point, I discard it
	      if (currentSegment.length==0)
			{	
			 stop_walking(); //clear the timer
			 walk();  //pass to the next queued segment
			}
		  else
		  {// next point of the segment
	       movement_direction = getMovementDirection(pacman.getLatLng(), currentSegment[0]);  //[0] can be where I am now  
	      }
	     }

}


/**
*  stop the timer, set the state to walking=false and
*  stop the sprite animation
*/
function stop_walking()
{
      walking=false;
 clearInterval(pacman_timer);
 if (icon_direction=="up")  
		 {
		  $('.pacman').removeClass('up');
		  $('.pacman').css('background-position', '0px 33px');
		 }
	 else if (icon_direction=="down")  
		 {
		  $('.pacman').removeClass('down');
		  $('.pacman').css('background-position', '0px 95px');
		 }
	 else if (icon_direction=="left")  
		 {
		  $('.pacman').removeClass('left');
		  $('.pacman').css('background-position', '0px 60px');
		 }
	 else if (icon_direction=="right")  
		 {
		  $('.pacman').removeClass('right');
		  $('.pacman').css('background-position', '0px 0px');
		 }	

}



function createLine(starting_point)
{
 trail = L.polyline([starting_point],
                    {
					   color: USER_PATH_COLOR,
					   weight: USER_PATH_WEIGHT,
					   opacity: USER_PATH_OPACITY,
					   clickable: false,
					   smoothFactor:1
					  }
				    );	
 drawnPath.addLayer(trail);
 drawnPath.bringToBack();
}





/** am i moving up,down,left or right? 
* used toward the end of the segment
*/
function getMainDirection(oldPosition, newPosition)
{
 var diff_lat;
 var diff_lng; 
 var direction;
 if (oldPosition.lat > newPosition.lat)
   {diff_lat = oldPosition.lat - newPosition.lat;
	direction = "down";   
   }
 else
   {diff_lat = newPosition.lat - oldPosition.lat;
	direction = "up"; 
   }
   
if (oldPosition.lng > newPosition.lng)
   {diff_lng = oldPosition.lng - newPosition.lng;
	if (diff_lng > diff_lat)
		{direction = "left";}
   }
 else
   {diff_lng = newPosition.lng - oldPosition.lng;
	 if (diff_lng > diff_lat)
		{direction = "right";}   
   } 
 return direction;     
}




/** am i moving up,down,left or right?
* used toward the very next point
 */
function getMovementDirection(oldPosition, newPosition)
{
 var diff_lat;
 var diff_lng; 
 var direction=[];
 if (oldPosition.lat > newPosition.lat)
   {direction.push("down");   }
 else
   { direction.push("up"); }
   
if (oldPosition.lng > newPosition.lng)
   {direction.push("left");}
 else
   {direction.push("right");}   
 return direction;     
}
