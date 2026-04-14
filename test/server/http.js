import http from 'http';
import Gun from '../../index.js';

var gun = Gun({ 
	file: 'http.json'
});

var server = http.createServer(function(req, res){});
gun.wsp(server);
server.listen(8765);

console.log('Server started on port ' + 8765 + ' with /gun');