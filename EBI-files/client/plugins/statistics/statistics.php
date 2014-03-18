<?php
/* DASTY
* Copyright (C) 2009-2010 Jose Villaveces 
* European Bioinformatics Institute (EBI)
*
* This program is free software: you can redistribute it and/or modify
* it under the terms of the GNU General Public License as published by
* the Free Software Foundation; either version 3 of the License, or
* (at your option) any later version.
*
* This program is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
* GNU General Public License for more details.
*
* You should have received a copy of the GNU General Public License
* along with this program. If not, see <http://www.gnu.org/licenses/>.
*/
	
    
    $action = $_POST["action"];
    //$statistics_url = "info/statistics.csv";//local test
    $statistics_url = "/net/isilon3/production/seqdb/sp/dasty/statistics/statistics.csv";//live
	
    //$prop_url = "info/properties.properties";//local test
    $prop_url = "/net/isilon3/production/seqdb/sp/dasty/statistics/properties.properties";//live
    
	if($action == 'addData'){
		$OSList = array
		(
	        // Match user agent string with operating systems
	        'Windows 3.11' => 'Win16',
	        'Windows 95' => '(Windows 95)|(Win95)|(Windows_95)',
	        'Windows 98' => '(Windows 98)|(Win98)',
	        'Windows 2000' => '(Windows NT 5.0)|(Windows 2000)',
	        'Windows XP' => '(Windows NT 5.1)|(Windows XP)',
	        'Windows Server 2003' => '(Windows NT 5.2)',
	        'Windows Vista' => '(Windows NT 6.0)',
	        'Windows 7' => '(Windows NT 7.0)',
	        'Windows NT 4.0' => '(Windows NT 4.0)|(WinNT4.0)|(WinNT)|(Windows NT)',
	        'Windows ME' => 'Windows ME',
	        'Open BSD' => 'OpenBSD',
	        'Sun OS' => 'SunOS',
	        'Linux' => '(Linux)|(X11)',
	        'Mac OS' => '(Mac_PowerPC)|(Macintosh)',
	        'QNX' => 'QNX',
	        'BeOS' => 'BeOS',
	        'OS/2' => 'OS/2',
	        'Search Bot'=>'(nuhk)|(Googlebot)|(Yammybot)|(Openbot)|(Slurp)|(MSNBot)|(Ask Jeeves/Teoma)|(ia_archiver)'
		);
		
		// Loop through the array of user agents and matching operating systems
		foreach($OSList as $CurrOS=>$Match){
		        // Find a match
		        if (eregi($Match, $_SERVER['HTTP_USER_AGENT'])){
		                // We found the correct match
		                break;
		        }
		}
		$data = getIpData($_SERVER["REMOTE_ADDR"]);
		$xml = simplexml_load_string($data);
		
		//Create line
		/*$line = array(date("d/m/Y"),date("G:i:s"),$_SERVER["REMOTE_ADDR"],$CurrOS,$_POST["browser"],
			$_POST["bVersion"],$_POST["proteinId"],$xml->Status[0],$xml->CountryCode[0],
			$xml->CountryName[0],$xml->RegionCode[0],$xml->RegionName[0],$xml->City[0],
			$xml->ZipPostalCode,$xml->Latitude,$xml->Longitude);*/
		
		$line = date("d/m/Y").",".date("G:i:s").",".$_SERVER["REMOTE_ADDR"].",".$CurrOS.",".$_POST["browser"].",".
			$_POST["bVersion"].",".$_POST["proteinId"].",".$xml->Status[0].",".$xml->CountryCode[0].",".
			$xml->CountryName[0].",".$xml->RegionCode[0].",".$xml->RegionName[0].",".$xml->City[0].",".
			$xml->ZipPostalCode.",".$xml->Latitude.",".$xml->Longitude."\n";
		//error_reporting(E_ALL);
		//ini_set('display_errors', '1');
		
		//open file
		$file = fopen($statistics_url,"a+") or die("can't open file");
		//add line
		fwrite ($file, $line);
		//close file
		fclose($file);
	}else if($action == 'getData'){
		$fh = fopen($prop_url, 'r');
		$pass = fread($fh, filesize($prop_url));
		$pass = substr($pass, strrpos ($pass,'=')+1, strlen($pass));
		fclose($fh);
		
		$password = $_POST["password"];
		if(md5($password) == $pass){
			readfile($statistics_url);
		}else {
			header("HTTP/1.0 403 Forbidden");
			echo "<h1>403 Forbidden</h1>
				<h2>It cannot be seen, cannot be felt,<br/>
				Cannot be heard, cannot be smelt<br/>
				It lies behind stars and under hills,<br/>
				And empty holes it fills.<br/>
				It comes first and follows after,<br/>
				Ends life, kills laughter</h2>.";
			exit();
		}
	}else{
		header("HTTP/1.0 404 Not Found");
		echo "<h1>404 Not Found</h1>";
		echo "The page that you have requested could not be found.";
		exit();
	}

	function getIpData($ip){
		$proxy = "http://wwwcache.ebi.ac.uk:3128/";
		$url = "http://ipinfodb.com/ip_query.php?timezone=false&ip=".$ip;
		
		$ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        
        curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 10);
        curl_setopt($ch, CURLOPT_TIMEOUT, 10);
       
        curl_setopt($ch, CURLOPT_HEADER, 1);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);

        if(strlen($proxy) != 0){
                curl_setopt($ch, CURLOPT_PROXY, $proxy);
        }
        /* Don't return HTTP headers. Do return the contents of the call */
        curl_setopt($ch, CURLOPT_HEADER, 0);


		/* DISPLAY DATA FROM THE ORIGINAL QUERY */
        $data = curl_exec($ch);
        curl_close($ch);
        //echo $data;
        return $data;
	}
?>