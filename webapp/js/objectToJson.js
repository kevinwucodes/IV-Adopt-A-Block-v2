 /** points = LatLng[]
	  name = name of the block (label)
  */
 function polygonToJSON(points, name)
 {
  var json = '{"polygon": {"name":"'+name+'", "id":"", "coordinates": [';
  for (i=0; i<points.length; i++)
   {
    point = points[i];
	json += ' {"lat":"'+point.lat+'", "lng":"'+point.lng+'"}';   
	if (i < points.length-1)
	   {json += ',';}  
   }
  json += ']}}';	 
  return json;
 }      
