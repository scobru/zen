import __gun from '../gun.js';
var Gun = (typeof globalThis !== "undefined")? globalThis.Gun : __gun;
const rel_ = '#';
const node_ = '_';

Gun.chain.unset = function(node){
	if( this && node && node[node_] && node[node_].put && node[node_].put[node_] && node[node_].put[node_][rel_] ){
		this.put( { [node[node_].put[node_][rel_]]:null} );
	}
	return this;
}
