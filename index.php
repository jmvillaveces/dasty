<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
<html>
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=iso-8859-1">
		<title>DASTY 3</title>
		<script type='text/javascript'>
			var getUrlVars = function(){
			    var vars = [], hash;
			    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
			    for(var i = 0; i < hashes.length; i++){
			        hash = hashes[i].split('=');
			        vars.push(hash[0]);
			        vars[hash[0]] = hash[1];
			    }
			    return vars;
			}
			
			var loc_str = 'index.html';
			var vars = getUrlVars('q');
			if(typeof vars['q'] !='undefined'){
				loc_str += '?q='+vars['q'];
			}
			window.location = loc_str;
			
		</script>
	</head>
	<body>
		
	</body>
</html>
