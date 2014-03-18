<?php
if($_POST[message]){
	// Mail to DASTY HELP
	$today = date("F j, Y, g:i a");	
	$message = "
	MESSAGE FROM THE WEB:
	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	FROM: $_POST[name]
	SUBJECT: $_POST[subject]
	E-MAIL: $_POST[email]
	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	$_POST[message]
	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	";

			$to = "rafael@ebi.ac.uk, dasty-help@ebi.ac.uk";
			$subject = "Dasty3: $_POST[subject]";
			$message = wordwrap($message, 70);
			$headers = "From: rafael@ebi.ac.uk" . "\r\n" . "Reply-To: rafael@ebi.ac.uk";
			$mail01 = mail($to, $subject, $message, $headers);	
	//echo($message);
	echo("Thanks for contacting us. Your message has been sent.");
}
?>