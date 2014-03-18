<?php
		

	function read_header($ch, $string) {
		global $headers;
//		echo $string;
	    $length = strlen($string);
	    if (false===strpos($string,"Transfer-Encoding"))
	   		$headers[]=$string;	
	    return $length;
	}
	
/* SPLIT PROXY FROM URL TO QUERY. QUERY: ALL INSIDE THE 'S' PARAMETER */
        $url = $_GET['url'];
		$isWriteback= !(false===strpos($url, "writeback"));
        // $url = str_replace("wwwdev", "www", $_GET['url']);
        //echo $url;
        //$url = $s;
		$headers=array();

/* SET INTERNAL PROXY */
        $proxy = "";
        //$proxy = "http://wwwcache.ebi.ac.uk:3128/";
        //$proxy = "http://wwwcache.sanger.ac.uk:3128/";


/* CURL CONFIGURARTION */
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        //curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 50);
        //curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 4);
        curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 10);
        curl_setopt($ch, CURLOPT_TIMEOUT, 10);
        //curl_setopt($ch, CURLOPT_TIMEOUT, 50);
        //curl_setopt($ch, CURLOPT_TIMEOUT, 8);
        curl_setopt($ch, CURLOPT_HEADER, 1);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        if(strlen($proxy) != 0){
                //curl_setopt($ch, CURLOPT_HTTPPROXYTUNNEL, 1);
                curl_setopt($ch, CURLOPT_PROXY, "$proxy");
        }
        /* Don't return HTTP headers. Do return the contents of the call */
        curl_setopt($ch, CURLOPT_HEADER, 0);
		curl_setopt($ch, CURLOPT_HEADERFUNCTION,"read_header");
		
		$expectedXMLAnswer=true;
		if ($isWriteback){
			if (isset($_REQUEST['method'])){
				if($_REQUEST['method']=="POST"){
					curl_setopt($ch, CURLOPT_POST, 1);
					curl_setopt($ch, CURLOPT_POSTFIELDS, "_content=".$_REQUEST['_content']);
					curl_setopt($ch, CURLOPT_FOLLOWLOCATION ,true);
				}elseif($_REQUEST['method']=="PUT"){
					curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'PUT');
					curl_setopt($ch, CURLOPT_POSTFIELDS, $_REQUEST['_content']);  
				}elseif($_REQUEST['method']=="DELETE"){
					curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "DELETE");
					//curl_setopt($ch, CURLOPT_URL, $url."?featureid=".$featureid."&segmentid=".$_REQUEST['segmentid']."&href=".$_REQUEST['href']."&user=".$_REQUEST['user']."&password=".$_REQUEST['password']);
				}
			}else if (!(false===strpos($url, "authenticate")) || !(false===strpos($url, "createuser")))
				$expectedXMLAnswer=false;
		}
		
/* DISPLAY DATA FROM THE ORIGINAL QUERY */
        $data = curl_exec($ch);
        curl_close($ch);

        if ($isWriteback){
                        for ($i=0;$i<sizeof($headers);$i++)
                        	if (strlen($header[$i]>0))header($headers[$i]);
				
			if ($expectedXMLAnswer) header("Content-Type: text/xml");
        }else{
	        $flag = strpos($url, "pdbe");
	        if($flag){
	            header("Content-Type: text/plain");
	        }else{
	            header("Content-Type: text/xml");
	        }
        }
        echo $data;
?>