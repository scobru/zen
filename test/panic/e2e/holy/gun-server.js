import panic from 'panic-client';
import ports from './ports';
import Gun from 'gun';
import http from 'http';

var gun = new Gun({
	file: 'delete-me.json'
});

var server = new http.Server(gun.wsp.server);

gun.wsp(server);

server.listen(ports.gun);

panic.server('http://localhost:' + ports.panic);