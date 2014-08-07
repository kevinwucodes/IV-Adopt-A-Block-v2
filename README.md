### IV Adopt-A-Block v2 ###

IV Adopt-a-Block is an application and platform in which mobile users are tracked along a route in Isla Vista during trash cleanup events.  Mobile users can additionally take pictures of hazardous pictures along the way to alert an administrator of a hazardous event.  All of the information is POSTed to a REST layer and is tracked in a Mongo database.  Finally, there would be an administrative web page that assists the administrator in aggregating statistics, view/verify routes, user searchable details, and other sumary pages.


#### TODO ####

 * middleware
   * HTTPS certs
   * CORS
   * authN/authZ
 * mobile
   * android
     * UX/UI
   * iOS
     * UX/UI
 * admin screen
   * weekly aggregations

 #### developer notes ####
 
Deploy to heroku requires git subtree deployment:  git subtree push --prefix middleware heroku master

   
