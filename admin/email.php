<?php
	$to  = "Daniele Fani' <iamdelac@gmail.com>";// . ", " ; // notare la virgola
     //$destinatari .= "Enrica <enrica@example.com>";

     /* oggetto */
	 $subject = "IV AAB system-mailer: hazard image";

	/* messaggio */
	$messagge = '
		<html>
		   <body>
		     <p>comment: '.$comment.'</p>
	       	 <a href="http://danielefani.altervista.org/cleanItUp/CITRIX/admin/photo_uploaded/'.$filename.'">click here to watch the photo />
	       	 <br>
	         <a href="http://maps.google.com/maps?&z=10&q='. $lat . '+'. $lng . '&ll=' . $lat . '+' . $lng.'">click here to see the position on the map</a>
	         <br>
	         <a href="http://danielefani.altervista.org/cleanItUp/CITRIX/admin">click here to open IV AaB admin web page</a>	       	 
		   </body>
		</html>';

	
	/* Per inviare email in formato HTML, si deve impostare l'intestazione Content-type. */
	$header  = "MIME-Version: 1.0\r\n";
	$header .= "Content-type: text/html; charset=iso-8859-1\r\n";
	/* intestazioni addizionali */
	$header .= "To: Daniele Fani <iamdelac@gmail.com>\r\n";
	$header .= "From: IV AaB<ivadoptablock@gmail.com>\r\n";	
	
	/* ed infine l'invio */
	if (mail($to, $subject, $messagge, $header))
	 {echo 'true';}
	else {echo 'false';}
?>	

