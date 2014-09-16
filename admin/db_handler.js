/*
{ 
 firstname: daniele,
 lastname: fani,
 trips: 
  [
   {
    tripID : 0001,
    completed: 4985959
   }, ....
  ]
}
*/

function db_get_all_trips(from, to)
{
 $.ajax(
 {
  url: "https://iv-adopt-a-block-v2.jit.su/users/completed/"+from+"/"+to,
  type: "GET",
  success: function(response)
  			 { db_get_all_trips_callback(response); },
  error: function(response) 
  			{ alert('db_get_all_trips: '+JSON.stringify(response)); }
 });
}




/*
{
 firstname: daniele,
 lastname: fani,
 trips: 
  [
   {
    tripID : 0001,
   }, ....
  ]
}
*/
function db_get_all_current_trips()
{
 $.ajax(
 {
  url: "https://iv-adopt-a-block-v2.jit.su/users/incomplete",
  success: function(response)
  			 {db_get_all_current_trips_callback(response); },
  error: function(response) 
  			{ alert('db_get_all_current_trips: '+JSON.stringify(response)); }
 });
}





/*
{
 firstname: daniele,
 lastname: fani,
 trips:
    {
     tripID: 300234023,
     points: 
     	[
     	 {
     	  lat: 45.23432
     	  long: 113.343
     	  epoch: 343242342
     	  received: 343242343
     	 }, ....
     	]
    }
}	
*/
function db_get_waypoints(tripID)
{
 $.ajax(
 {
  url: "https://iv-adopt-a-block-v2.jit.su/users/waypoints",
  data: '{"tripID":'+tripID+'}',
  success: function(response)
  			 {db_get_waypoints_callback(response); },
  error: function(response) 
  			{ alert('db_get_waypoints: '+JSON.stringify(response)); }
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


function db_get_all_trips2()
{
 
 trips={ 
    "firstname" : "daniele",
    "lastname" : "fani'",
    "trips" : [ 
        {
            "blocks" : 1.5,
            "buckets" : 0.75,
            "completed" : 1408450957380,
            "created" : 1408450942863,
            "tripCategory" : "type1",
            "tripID" : "dae21869-588f-40a2-b6b6-bfa70d134971"
        }, 
        {
            "blocks" : 1,
            "buckets" : 3,
            "completed" : 1408464097814,
            "created" : 1408464030784,
            "points" : [ 
                {
                    "lat" : 34.41447758298938,
                    "long" : -119.8583453893661,
                    "epoch" : 1408464034640,
                    "received" : 1408464035063
                }, 
                {
                    "lat" : 34.41447758298938,
                    "long" : -119.8579484224319,
                    "epoch" : 1408464039808,
                    "received" : 1408464040120
                }, 
                {
                    "lat" : 34.41443775358987,
                    "long" : -119.8574709892273,
                    "epoch" : 1408464045150,
                    "received" : 1408464045388
                }, 
                {
                    "lat" : 34.41445545554755,
                    "long" : -119.8570364713669,
                    "epoch" : 1408464049154,
                    "received" : 1408464049475
                }, 
                {
                    "lat" : 34.41444217907966,
                    "long" : -119.856328368187,
                    "epoch" : 1408464059970,
                    "received" : 1408464060353
                }, 
                {
                    "lat" : 34.41444217907966,
                    "long" : -119.8560118675232,
                    "epoch" : 1408464063491,
                    "received" : 1408464063798
                }, 
                {
                    "lat" : 34.41445545554755,
                    "long" : -119.8554003238678,
                    "epoch" : 1408464067815,
                    "received" : 1408464068055
                }, 
                {
                    "lat" : 34.41444217907966,
                    "long" : -119.8554271459579,
                    "epoch" : 1408464075286,
                    "received" : 1408464075550
                }, 
                {
                    "lat" : 34.41443332809988,
                    "long" : -119.8549067974091,
                    "epoch" : 1408464080086,
                    "received" : 1408464080382
                }
            ],
            "tripCategory" : "type1",
            "tripID" : "faf367f7-9221-49b1-95bc-d283d5682114"
        }, 
        {
            "tripID" : "fe01f1b4-5ca7-4756-a7ca-8b7f0a2af8c6",
            "created" : 1408465730365,
            "tripCategory" : "type1"
        }
    ]
}

return trips;

}


















