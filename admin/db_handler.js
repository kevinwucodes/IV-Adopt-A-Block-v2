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
  url: "https://iv-adopt-a-block-v2.jit.su/users/completed/"+from+"/"+to,
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
 $.ajax(
 {
  url: "https://iv-adopt-a-block-v2.jit.su/users/incomplete/today",
  success: function(response)
  			 {db_get_all_current_trips_callback(response); },
  error: function(response) 
  			{ alert('db_get_all_current_trips: '+JSON.stringify(response)); }
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
  url: "https://iv-adopt-a-block-v2.jit.su/users/waypoints/"+tripID,
  success: function(response)
  			 {alert('db_get_waypoints: '+JSON.stringify(response));
  			  db_get_waypoints_callback(response); },
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
  url: "https://iv-adopt-a-block-v2.jit.su/users/waypoints/"+tripID,
  success: function(response)
  			 { db_get_last_waypoint_callback(response); },
  error: function(response) 
  			{ alert('db_get_last_waypoint: '+JSON.stringify(response)); }
 });
}




function db_get_all_volunteer_trips(name, surname)
{
 $.ajax(
 {
  url: "https://iv-adopt-a-block-v2.jit.su/users",
  data: '{"name":'+start+', "surname":'+end+'}',
  type: "GET",
  success: function(response)
  			 {db_get_all_volunteer_trips_callback(response); },
  error: function(response) 
  			{ alert('db_get_all_volunteer_trips: '+JSON.stringify(response)); }
 });
}
























