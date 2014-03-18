#!"C:\xampp\perl\bin\perl.exe"
use LWP::UserAgent [search.cpan.org]; 
use HTTP::Request [kobesearch.cpan.org];
use CGI qw/:standard/;

$query = CGI->new;

my $URL = $query->param('url');
my $agent = LWP::UserAgent->new(env_proxy => 1,keep_alive => 1, timeout => 8);
my $request = HTTP::Request->new('GET', $URL); 
my $response = $agent->request($request);

# Check the outcome of the response 
	
	
	print "Status: ", $response->status_line(), "\n";
	#DAS Headers
	print "X-DAS-Status: ", $response->header('X-DAS-Status'), "\n";
	print "X-DAS-Server: ", $response->header('X-DAS-Server'), "\n";
	#Content Type
	print "Content-type: ", ($response->content_type || 'text/xml'), "\n\n";
	print $response->content;
	#print $response->as_string;