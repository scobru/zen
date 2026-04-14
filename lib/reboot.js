import __child_process from 'child_process';
import { fileURLToPath } from 'node:url';
import { dirname as __dirnameOf } from 'node:path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = __dirnameOf(__filename);
(function(){
	var exec = __child_process.execSync;
	var dir = __dirname, tmp;

	try{exec("crontab -l");
	}catch(e){tmp = e}
	if(0 > tmp.toString().indexOf('no')){ return }

	try{tmp = exec('which node').toString();
	}catch(e){console.log(e);return}

	try{tmp = exec('echo "@reboot '+tmp+' '+dir+'/../examples/http.js" > '+dir+'/reboot.cron');
	}catch(e){console.log(e);return}

	try{tmp = exec('crontab '+dir+'/reboot.cron');
	}catch(e){console.log(e);return}
	console.log(tmp.toString());

}());