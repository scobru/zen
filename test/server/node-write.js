import Zen from '../../index.js';
var location = {host:"localhost"};
var gun = Zen( { file: 'write.json', peers: ['http://' + location.host + ':8765/gun'] });

gun.get( 'data' ).path('stuff').put({a: {data: 1}, b: {data: 2}});