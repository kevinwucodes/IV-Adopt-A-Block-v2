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
  url: MONGO_SERVER_URL+"/users/images",
  type: "GET",
  success: function(response)
  			 { db_get_all_images_callback(response); },
  error: function(response) 
  			{  alert('db_get_all_images: '+JSON.stringify(response)); }
 });
}




 
/* right now is not used... I alrady have the url
   it was used with mediafire
*/
function db_get_image(imageId)
{
 $.ajax(
 {
  url: MONGO_SERVER_URL+"/image/"+imageId,
  type: "GET",
  success: function(response)
  			 { db_get_image_callback(response); },
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
  url: MONGO_SERVER_URL+"/users/completed/"+from+"/"+to,
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
  url: MONGO_SERVER_URL+"/users/incomplete/today",
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
  url: MONGO_SERVER_URL+"/users/waypoints/"+tripID,
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
  url: MONGO_SERVER_URL+"/users/waypoints/"+tripID,
  success: function(response)
  			 { db_get_last_waypoint_callback(response); },
  error: function(response) 
  			{ alert('db_get_last_waypoint: '+JSON.stringify(response)); }
 });
}

























