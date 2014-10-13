/*
[
  {
    tripID: #tripID#,
    images: {
      ...(all the image schema attributes are here)
    }
  }, ...
]	
*/
function db_get_all_images()
{
  loading();
 $.ajax(
 {
  url: "http://iv-aab-v2-132969.usw1.nitrousbox.com/users/images",
  type: "GET",
  success: function(response)
  			 { db_get_all_images_callback(response); },
  error: function(response) 
  			{  alert('db_get_all_images: '+JSON.stringify(response)); }
 });
}






function db_get_image(imageId)
{
 $.ajax(
 {
  url: "http://iv-aab-v2-132969.usw1.nitrousbox.com/image/"+imageId,
  type: "GET",
  success: function(response)
  			 {  alert("I should visualize the image "+imageId+". there is still some problem with the mediafire url... this is what I can get now:\n\n\n"+'db_get_image: '+JSON.stringify(response)); },
  	//		 { db_get_image_callback(response); },
  error: function(response) 
  			{  alert('db_get_image: '+JSON.stringify(response)); }
 });
}




 

/*
 {
    start: #:start#,
    end: #:end#,
    data: [
      {
        firstname: #firstname#,
        lastname: #lastname#,
        trips: [
          {
            tripID: #tripID#,
            created : #date#,
            buckets: #buckets#,
            blocks: #blocks#,
            completed: #completed#
          }, ...
        ]
      }, ...
    ]
  }*/

function db_get_all_trips(from, to)
{
  loading();
 $.ajax(
 {
  url: "http://iv-aab-v2-132969.usw1.nitrousbox.com/users/completed/"+from+"/"+to,
  type: "GET",
  success: function(response)
  			 { db_get_all_trips_callback(response); 
	  		   stopLoading();
  			 },
  error: function(response) 
  			{  stopLoading();
  			   alert('db_get_all_trips: '+JSON.stringify(response)); 
  			}
 });
}




/*
 {
    since: #since#, (would be epoch of 12:00am of the current date)
    data: [
      {
        firstname: #firstname#,
        lastname: #lastname#,
        trips: [
          {
            tripID: #tripID#,
            created : #date#
          }, ...
        ]
      }, ...
    ]
  }
*/
function db_get_all_current_trips()
{
   loading();
 $.ajax(
 {
  url: "http://iv-aab-v2-132969.usw1.nitrousbox.com/users/incomplete/today",
  success: function(response)
  			 {  stopLoading(); db_get_all_current_trips_callback(response); },
  error: function(response) 
  			{ stopLoading(); alert('db_get_all_current_trips: '+JSON.stringify(response)); }
 });
}





/*
{
    firstname: #firstname#,
    lastname: #lastname#,
    trips: {
      tripID: #tripID#,
      points: [ 
                {
                    "lat" : #lat#,
                    "long" : #long#,
                    "epoch" : #epoch#,
                    "received" : #received#
                }, ...
      ]
    }
  }	
*/
function db_get_waypoints(tripID)
{
 $.ajax(
 {
  type: "GET",
  url: "http://iv-aab-v2-132969.usw1.nitrousbox.com/users/waypoints/"+tripID,
  success: function(response)
  			 { db_get_waypoints_callback(response); },
  error: function(response) 
  			{ alert('db_get_waypoints: '+JSON.stringify(response)); }
 });
}




/*
{
    firstname: #firstname#,
    lastname: #lastname#,
    trips: {
      tripID: #tripID#,
      points: [ 
                {
                    "lat" : #lat#,
                    "long" : #long#,
                    "epoch" : #epoch#,
                    "received" : #received#
                }, ...
      ]
    }
  }	
*/
function db_get_last_waypoint(tripID)
{
 $.ajax(
 {
  type: "GET",
  url: "http://iv-aab-v2-132969.usw1.nitrousbox.com/users/waypoints/"+tripID,
  success: function(response)
  			 { db_get_last_waypoint_callback(response); },
  error: function(response) 
  			{ alert('db_get_last_waypoint: '+JSON.stringify(response)); }
 });
}

























