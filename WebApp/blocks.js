function readAndLoadBlocks()
{
polygons_json ={"polygons": [{"polygon": {"name":"Embarcadero del Mar", "pacman":[], "coordinates": [ {"lat":"34.413154351675736", "lng":"-119.85701233148575"}, {"lat":"34.41269409239843", "lng":"-119.85702037811278"}, {"lat":"34.41212982877079", "lng":"-119.8570230603218"}, {"lat":"34.41143279197512", "lng":"-119.85701233148575"}, {"lat":"34.41115397563039", "lng":"-119.856875538826"}, {"lat":"34.41098801307916", "lng":"-119.85661536455154"}, {"lat":"34.410888435390376", "lng":"-119.85623717308044"}, {"lat":"34.410950394855114", "lng":"-119.85596090555191"}, {"lat":"34.411111931815235", "lng":"-119.85565781593321"}, {"lat":"34.41120265791628", "lng":"-119.85555589199066"}, {"lat":"34.411459345864245", "lng":"-119.85544055700302"}, {"lat":"34.41202361401517", "lng":"-119.8554217815399"}, {"lat":"34.412815795819036", "lng":"-119.85542982816696"}, {"lat":"34.413132223883814", "lng":"-119.85542982816696"}, {"lat":"34.413130011104315", "lng":"-119.85536009073257"}, {"lat":"34.41262107026105", "lng":"-119.85537350177763"}, {"lat":"34.41183552505449", "lng":"-119.85537350177763"}, {"lat":"34.41155449723103", "lng":"-119.85537081956862"}, {"lat":"34.411339853296816", "lng":"-119.8554217815399"}, {"lat":"34.41112742164433", "lng":"-119.8555263876915"}, {"lat":"34.41096588471413", "lng":"-119.85577046871185"}, {"lat":"34.410841965761705", "lng":"-119.85612988471985"}, {"lat":"34.41084860428167", "lng":"-119.85630959272386"}, {"lat":"34.41093269215558", "lng":"-119.85665023326874"}, {"lat":"34.411038908296554", "lng":"-119.85682189464568"}, {"lat":"34.41126461714828", "lng":"-119.85701501369476"}, {"lat":"34.411474835629015", "lng":"-119.85708206892014"}, {"lat":"34.411937314426886", "lng":"-119.8570927977562"}, {"lat":"34.41242191865327", "lng":"-119.85707938671112"}, {"lat":"34.4131521388968", "lng":"-119.85707670450212"}]}}, {"polygon": {"name":"Pardall", "pacman":[{"lat":"34.41311452164607", "lng":"-119.85868334770201"},{"lat":"34.413121159985664","lng":"-119.8570391535759"}], "coordinates": [ {"lat":"34.413136649442684", "lng":"-119.85541641712187"}, {"lat":"34.413132223883814", "lng":"-119.85468953847884"}, {"lat":"34.41312337276541", "lng":"-119.85415041446686"}, {"lat":"34.413121159985664", "lng":"-119.85377490520477"}, {"lat":"34.413070266035305", "lng":"-119.85377758741379"}, {"lat":"34.41307469159746", "lng":"-119.85397607088089"}, {"lat":"34.41308575550174", "lng":"-119.85440790653227"}, {"lat":"34.41309018106305", "lng":"-119.85493361949919"}, {"lat":"34.41309239384362", "lng":"-119.85542446374895"}]}}, {"polygon": {"name":"Madrid", "pacman":[], "coordinates":[{"lat":"34.41248608977867", "lng":"-119.85535740852356"}, {"lat":"34.41248387698207", "lng":"-119.85463321208954"}, {"lat":"34.41247945138868", "lng":"-119.85381782054901"}, {"lat":"34.41242191865327", "lng":"-119.85381782054901"}, {"lat":"34.41242191865327", "lng":"-119.8543918132782"}, {"lat":"34.41243076984592", "lng":"-119.8551481962204"}, {"lat":"34.41243962103762", "lng":"-119.85537350177763"}]}}, {"polygon": {"name":"Seville west", "pacman":[], "coordinates":[{"lat":"34.4118421634956", "lng":"-119.85702574253081"}, {"lat":"34.41184658912271", "lng":"-119.85756754875183"}, {"lat":"34.4118421634956", "lng":"-119.8582112789154"}, {"lat":"34.41183995068196", "lng":"-119.8587316274643"}, {"lat":"34.411771353429955", "lng":"-119.8587316274643"}, {"lat":"34.411771353429955", "lng":"-119.85837757587433"}, {"lat":"34.41178241750668", "lng":"-119.85788404941559"}, {"lat":"34.41178684313694", "lng":"-119.85731542110442"}, {"lat":"34.411789055951985", "lng":"-119.85702574253081"}]}},{"polygon": {"name":"Seville est", "pacman":[], "coordinates": [ {"lat":"34.41183552505449", "lng":"-119.85366225242615"}, {"lat":"34.411853227562936", "lng":"-119.85455811023712"}, {"lat":"34.411853227562936", "lng":"-119.85544323921204"}, {"lat":"34.411755863720124", "lng":"-119.855437874794"}, {"lat":"34.41176471498325", "lng":"-119.85488533973692"}, {"lat":"34.4117514380882", "lng":"-119.8541611433029"}, {"lat":"34.41176028935178", "lng":"-119.85365688800812"}]}},{"polygon": {"name":"Madrid west", "pacman":[], "coordinates": [ {"lat":"34.41249051537171", "lng":"-119.8570364713669"}, {"lat":"34.41249494096452", "lng":"-119.85744416713715"}, {"lat":"34.41249494096452", "lng":"-119.85812008380888"}, {"lat":"34.41249051537171", "lng":"-119.8587316274643"}, {"lat":"34.41241085466116", "lng":"-119.85874235630035"}, {"lat":"34.412415280258195", "lng":"-119.85840976238251"}, {"lat":"34.412428557047846", "lng":"-119.85780358314514"}, {"lat":"34.41242413145152", "lng":"-119.85727250576018"}, {"lat":"34.412415280258195", "lng":"-119.85702037811278"}]}},{"polygon": {"name":"Pardall center", "pacman":[], "coordinates": [ {"lat":"34.4131410750013", "lng":"-119.85535740852356"}, {"lat":"34.41314550055968", "lng":"-119.85612452030182"}, {"lat":"34.413154351675736", "lng":"-119.85707402229308"}, {"lat":"34.413070266035305", "lng":"-119.85707938671112"}, {"lat":"34.413079117159356", "lng":"-119.85655903816223"}, {"lat":"34.413079117159356", "lng":"-119.8558187484741"}, {"lat":"34.41305256378447", "lng":"-119.85535204410553"}]}},{"polygon": {"name":"Pardall est", "pacman":[], "coordinates": [ {"lat":"34.413163202790855", "lng":"-119.85701501369476"}, {"lat":"34.41316762834807", "lng":"-119.85788404941559"}, {"lat":"34.41315877723341", "lng":"-119.85869944095612"}, {"lat":"34.413083542721", "lng":"-119.85870480537415"}, {"lat":"34.41308796828243", "lng":"-119.85823273658751"}, {"lat":"34.41308796828243", "lng":"-119.8573851585388"}, {"lat":"34.41307469159746", "lng":"-119.85700964927673"}]}}]};


for (p=0; p<polygons_json.polygons.length; p++)
  {
   poly_coord = polygons_json.polygons[p].polygon.coordinates;
   vertex[p] = [];
   currentBlockIndex=p;
   var latlng_coordinates=[]; //contains the points of the polygon
   for (c=0; c<poly_coord.length; c++)
	   	{ 
	   	 var point = L.latLng(poly_coord[c].lng, poly_coord[c].lat);
	   	 latlng_coordinates.push([poly_coord[c].lng, poly_coord[c].lat]);
	   	 addVertex(point.lat, point.lng);
	   	}
	   	
	addBlock(latlng_coordinates, polygons_json.polygons[p].polygon.name);
    
    if (polygons_json.polygons[p].polygon.pacman.length > 0)
	    {  addPacManLine(polygons_json.polygons[currentBlockIndex].polygon.pacman);	 }
		  
       //alert( JSON.stringify((poly.geometry.coordinates)));

    timer = setInterval(function(){set_position();},5000);
  }
  

}



function addVertex(lat, lng)
{
	   	 
	   	 var circle_json  = {
					      type: 'Feature',
					      geometry: 
					         {
					          type: 'Point',
					          coordinates: [lat, lng]
					         },
					      properties: 
					         {
					           radius:"5",
						       stroke: true,
						       color: '#f06eaa',
						       weight: 4,
						       opacity: 0.4,
						       fill: true,
						       fillColor: null, //same as color by default
						       fillOpacity: 0.1,
						       clickable: true
					         }
					  };
		var circle = L.geoJson(circle_json, 
						      {pointToLayer: function(feature, latlng) 
						      				    {return L.circleMarker(latlng, {radius: feature.properties.radius})},
						       style: function(feature) { return feature.properties; }});			  
		 drawnItems.addLayer(circle);
	     vertex[currentBlockIndex].push(circle);


}



function addBlock(latlng_coordinates, name)
{
 var shape_json  = {
					   type: "Feature",
					   geometry: 
					   	 {
						 type: "Polygon",
						 coordinates: [latlng_coordinates]
						 },
						properties: 
						 {
						    stroke: true,
							color: BLOCK_COLOR,
							weight: 4,
							opacity: BLOCK_STROKE_OPACITY,
							fill: true,
							fillColor: null, //same as color by default
							fillOpacity: BLOCK_FILL_OPACITY,
							clickable: true
						 }
    				   };
	var shape = L.mapbox.featureLayer();
	shape = L.geoJson(shape_json, {style: function(feature) { return feature.properties; }});
    drawnItems.addLayer(shape);
    shape.bindLabel(name);
    shape.bindPopup(getHTML_block_popup(currentBlockIndex));

    blocks.push(shape);
    
    //when click on a polygon, save it as currentBlock
    shape.on('click', function(e)
	      						 {
	      						  for (b=0; b<blocks.length;b++)
	      						   {if (blocks[b]==e.target)
		      						 {currentBlockIndex = b;}
	      						   }
	      						 });
	      						 
	  //once clicked on a polygon, its popup automatically opens up.
	  //anyway I can't refer directly to the content of its popup because it doesn't exist yet    		
	  //so I refer to #map and then #add-buttonX			 
	 $('#map').on('click', '#add-button'+currentBlockIndex, function(e) 
	         {
			  message = L.DomUtil.get('block_name_popup'+currentBlockIndex).value;
	          blocks[currentBlockIndex].bindLabel(message); 
	          blocks[currentBlockIndex].closePopup();
	         });     						 
}


function addPacManLine(pacman)
{
 var pacman_points=[];
	         for (pp=0; pp < pacman.length; pp++)
		         {  pacman_points.push([pacman[pp].lng, pacman[pp].lat]); }
		     var pacman_json  = 
				 	    	{
							      type: 'Feature',
							      geometry: 
							         {
							          type: 'LineString',
							          coordinates: pacman_points
							         },
							      properties: 
							         {
								       color: '#FFCC00',
								       weight: 8,
								       opacity: 1,
								       clickable: false,
								       dashArray: [1, 30] 
							         }
							  };
			 pacman_line = L.geoJson(pacman_json, {style: function(feature) { return feature.properties; }});
			 pacman_lines.push(pacman_line);
			 drawnItems.addLayer(pacman_line);
}





function addCoveredPath(current_lng, current_lat)
{
 var line_json  = 
			 	    	{
						      type: 'Feature',
						      geometry: 
						         {
						          type: 'LineString',
						          coordinates: [
						                         [lastPosition.lng, lastPosition.lat],
						                         [current_lng, current_lat]
						                       ]
						         },
						      properties: 
						         {
							       color: USER_PATH_COLOR,
							       weight: 8,
							       opacity: USER_PATH_OPACITY,
							       clickable: false,
						         }
						  };
  var line = L.geoJson(line_json, {style: function(feature) { return feature.properties; }});	
  drawnItems.addLayer(line);
}
