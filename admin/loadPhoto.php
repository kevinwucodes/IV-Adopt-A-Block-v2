<?php
if ( isset( $_FILES["blob"] ) ) 
{	
    // get info from DataForm
    $tripid = $_POST["tripID"];
    $image  = $_FILES["blob"];
    $lat  = $_POST["lat"];
    $lng  = $_POST["lng"];
    $epoch  = $_POST["epoch"];
    $comment  = $_POST["comment"];
    $code   = (int)$image["error"];
    $imageType = $_POST["imageType"]; 
    $type = $_POST["type"];
         
    $error  = false;         
    $valid  = array( IMAGETYPE_PNG, IMAGETYPE_JPEG, IMAGETYPE_GIF );
    // Generate filename
    $filename = md5(mt_rand()).'.jpg';  
    $folder = dirname( __FILE__ )."/photo_uploaded/"; // path to folder to where you want to move uploaded file
    $target = $folder.$filename;
    
   if ( !file_exists( $folder ) ) {
      @mkdir( $folder, 0755, true ) ;
    }

    if ( $code !== UPLOAD_ERR_OK ) {
      switch( $code ) {
        case UPLOAD_ERR_INI_SIZE:
          $error  = 'Error '.$code.': The uploaded file exceeds the "http://www.php.net/manual/en/ini.core.php#ini.upload-max-filesize"  directive in php.ini';
        break;
        case UPLOAD_ERR_FORM_SIZE:
          $error  = 'Error '.$code.': The uploaded file exceeds the MAX_FILE_SIZE directive that was specified in the HTML form';
        break;
        case UPLOAD_ERR_PARTIAL:
          $error  = 'Error '.$code.': The uploaded file was only partially uploaded';
        break;
        case UPLOAD_ERR_NO_FILE:
          $error  = 'Error '.$code.': No file was uploaded';
        break;
        case UPLOAD_ERR_NO_TMP_DIR:
          $error  = 'Error '.$code.': Missing a temporary folder';
        break;
        case UPLOAD_ERR_CANT_WRITE:
          $error  = 'Error '.$code.': Failed to write file to disk';
        break;
        case UPLOAD_ERR_EXTENSION:
          $error  = 'Error '.$code.': A PHP extension stopped the file upload';
        break;
        default:
          $error  = 'Error '.$code.': Unknown upload error'; 
        break; 
      }
    }  
    else {
      $iminfo = @getimagesize( $image["tmp_name"] );
      if ( $iminfo && is_array( $iminfo ) ) {
        if ( isset( $iminfo[2] ) && in_array( $iminfo[2], $valid ) && is_readable( $image["tmp_name"] ) ) {
          if ( !move_uploaded_file( $image["tmp_name"], $target ) ) {
            $error  = "Error while moving uploaded file";
          }
        }
        else {
          $error  = "Invalid format or image is not readable";
        }
      }
      else {
        $error  = "Only image files are allowed (jpg, gif, png)";
      }
    }
    
    
    if ( empty( $error ) ) 
     {   
	 /*manda la mail agli amministratori*/
	 /* destinatari */
     $to  = "Daniele Fani' <iamdelac@gmail.com>";// . ", " ; // notare la virgola
     $to .= ", Adam Porte <aporte@ivparks.org>";
     //$destinatari .= "Enrica <enrica@example.com>";

     /* oggetto */
	 $subject = "IV AAB system-mailer: hazard image";

	/* messaggio */
	$messagge = '
		<html>
		   <body>
		     <p>comment: '.$comment.'</p>
	       	 click <a href="http://danielefani.altervista.org/cleanItUp/CITRIX/admin/photo_uploaded/'.$filename.'">here </a> to watch the photo
	       	 <br><br>
	         click <a href="http://maps.google.com/maps?&z=10&q='.$lat.'+'.$lng.'&ll='.$lat.'+'.$lng.'">
	            here </a>  to see the position on the map
	         <br>
	         click <a href="http://danielefani.altervista.org/cleanItUp/CITRIX/admin"> here </a> to open IV AaB admin web page	
	       <br><br><br><br><br><br><br><br>         	 
		   </body>
		</html>';

	
	/* Per inviare email in formato HTML, si deve impostare l'intestazione Content-type. */
	$header  = "MIME-Version: 1.0\r\n";
	$header .= "Content-type: text/html; charset=iso-8859-1\r\n";
	$header .= "From: IV Adopt a Block <ivadoptablock@gmail.com>\r\n";	
	
	/* ed infine l'invio */
	if (mail($to, $subject, $messagge, $header)  )
	   {
		 echo  ('{"error" : 0, "url": "http:////danielefani.altervista.org//cleanItUp//CITRIX/admin//photo_uploaded//'.$filename.'","comment":"'.$comment.'", "point" : {"lat":"'.$lat.'", "lng":"'.$lng.'", "epoch":"'.$epoch.'"}, "tripId":"'.$tripid.'", "imageType":"'.$imageType.'", "type":"'.$type.'"}');  
	   }
	else 
	   {
	    echo  ('{"error" : 1, "message":"mail not sent"}');      
	   }  
     }
    else  
     {  echo (' { "error" : 1, "message" : "'.$error.'" }'  ); }
    exit();
  }
 ?>