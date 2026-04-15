import Zen from '../zen.js';
import formidable from 'formidable';
import url from 'url';

export default function(req, res, next){
	next = next || function(){}; // if not next, and we don't handle it, we should res.end
	if(!req || !res){ return next() }
	if(!req.url){ return next() }
	if(!req.method){ return next() }
	var msg = {};
	msg.url = url.parse(req.url, true);
	msg.method = (req.method||'').toLowerCase();
	msg.headers = req.headers;
	var u, body
	,	form = new formidable.IncomingForm()
	,	post = function(err, body){
		if(u !== body){ msg.body = body }
		next(msg, function(reply){
			if(!res){ return }
			if(!reply){ return res.end() }
			if(Zen.obj.has(reply, 'statusCode') || Zen.obj.has(reply, 'status')){
				res.statusCode = reply.statusCode || reply.status;
			}
			if(reply.headers){
				if(!(res.headersSent || res.headerSent || res._headerSent || res._headersSent)){
					Zen.obj.map(reply.headers, function(val, field){
						if(val !== 0 && !val){ return }
						res.setHeader(field, val);
					});
				}
			}
			if(Zen.obj.has(reply,'chunk') || Zen.obj.has(reply,'write')){
				res.write(Zen.text.ify(reply.chunk || reply.write) || '');
			}
			if(Zen.obj.has(reply,'body') || Zen.obj.has(reply,'end')){
				res.end(Zen.text.ify(reply.body || reply.end) || '');
			}
		});
	}
	form.on('field',function(k,v){
		(body = body || {})[k] = v;
	}).on('file',function(k,v){
		return; // files not supported in gun yet
	}).on('error',function(e){
		if(form.done){ return }
		post(e);
	}).on('end', function(){
		if(form.done){ return }
		post(null, body);
	});
	form.parse(req);
};