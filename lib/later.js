import __gun from '../gun.js';
import __open from './open.js';
var Gun = Gun || __gun;
Gun.chain.open || __open;

Gun.chain.later = function(cb, age){
	var gun = this;
	age = age * 1000; // convert to milliseconds.
	setTimeout(function(){
		gun.open(cb, {off: true});
	}, age);
	return gun;
}