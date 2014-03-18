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
	
	$action = $_GET["action"];
	
	$save_url = "/net/isilon3/production/seqdb/sp/dasty/configurations/";//live
	//$save_url = "saved_configurations/";//testing
	
	if($action == "get_saved_conf"){
		$filename = $_GET["fname"];
		$file = fopen($save_url.$filename.".json","a+");
		$data = fread($file,filesize($save_url.$filename.".json"));
		fclose($file);
		
		echo $data;
		
	}else if($action == "save_conf"){
		$json = $_GET["json"];
		$timestamp = time();
		
		$url = $save_url.$timestamp.".json";
		
		//open file
		$file = fopen($url,"a+");
		//add line
		fwrite ($file, $json);
		//close file
		fclose($file);
		
		header("Content-type: application/octet-stream");
		header("Content-Disposition: filename=\"dasty_conf.json"."\"");
		readfile($url);
		unlink($url); //delete file
		
	}else if($action == "upload_conf"){
		//if (($_FILES["file"]["type"] == "application/octet-stream") && ($_FILES["file"]["size"] < 10000)){
		if ($_FILES["file"]["size"] < 10000){
			if ($_FILES["file"]["error"] > 0){
				echo "Return Code: " . $_FILES["file"]["error"] . "<br />";
			}else{
				$timestamp = time();
				move_uploaded_file($_FILES["file"]["tmp_name"],$save_url."u_" .$timestamp.".json");
				
				header ("Location: ../index.html?conf=u_$timestamp");
			}
		}else{
	  		echo "File too big";
		}
	}else{
		header("HTTP/1.0 404 Not Found");
		echo "<h1>404 Not Found</h1>";
		echo "The page that you have requested could not be found.";
		exit();
	}
?>