// actually I stay always in the SAME PAGE

function init_page_editor()
{
 map.addControl(drawControl);	
// map.removeLayer(pacman_layer);
 $( "#left-panel" ).panel( "close" ); 
}


function init_page_realTime()
{
 map.removeControl(drawControl);	
 map.removeLayer(pacman_layer);
 $( "#left-panel" ).panel( "close" ); 
}


function init_page_PacMan()
{
 map.setZoom('18');
 pacman_layer.addTo(map);	
 $( "#left-panel" ).panel( "close" );
 map.setView(map.getCenter(), 18); // fix the zoom at 18! so, with a big PacMan and a thick line,  it's easyer cover all the points
 map.removeControl(drawControl);
}  

