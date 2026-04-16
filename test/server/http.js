import http from 'http';
import Zen from '../../index.js';

var gun = Zen({ 
	file: 'http.json'
});

var server = http.createServer(function(req, res){});
gun.wsp(server);
server.listen(8765);

console.log('Server started on port ' + 8765 + ' with /gun');