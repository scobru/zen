import __emailjs from 'emailjs';

let __defaultExport;
(function(){
	var email, fail = {send: function(opt, cb){ cb && cb("You do not have email installed.") } };
	if(!process.env.EMAIL){ return __defaultExport = fail }
	try{ email = __emailjs }catch(e){};
	if(!email){ return __defaultExport = fail }
	return __defaultExport = email.server.connect({
	  user: process.env.EMAIL,
	  password: process.env.EMAIL_KEY,
	  host: process.env.EMAIL_HOST || "smtp.gmail.com",
	  ssl: process.env.EMAIL_SSL || true
	});
}());
export default __defaultExport;