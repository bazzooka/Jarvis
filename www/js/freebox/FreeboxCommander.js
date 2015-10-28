import ChaineDetecter from './ChaineDetecter.js';
import commands from './commands.json';
import chaines from './chaines.json';
 
let FreeboxCommander = {
	baseUrl : "http://hd1.freebox.fr/pub/remote_control?code=",
	code: "50914410",
	repeatInterval : null,

	getFinalUrl : function(){
		return (this.baseUrl + this.code + "&key=");
	},

	loadPlugin: function(){
		return {
			commands : commands.commandes.concat(chaines.chaines),
			callback: this.sendCommand,
			module: "freebox"
		}
	},

	// sendCommand: function(callback, key, repeat = 1){
	executeCommande: function(command, order, callback){
		console.log(command);
		switch(command.com.id){
			case "vol_inc":
			case "vol_dec":
			case "mute":
				this.stopRepeatInterval(callback);
				if(command.parameters.numbers && command.compareWith.indexOf("{NUMBER}") >= 0){
					this.freeRemoteSend(this.getFinalUrl() + command.com.id + "&repeat=" + command.parameters.numbers[0], callback);
				} else {
					this.freeRemoteSend(this.getFinalUrl() + command.com.id, callback);
				}
				break;
			case "stop_balayage": 
				this.stopRepeatInterval(callback);
				break;
			case "power":
				this.stopRepeatInterval(callback);
				this.freeRemoteSend(this.getFinalUrl() + command.com.id, callback);
				break;
			case "balayage": 
				this.stopRepeatInterval();
				let i = 0,
					interval = 1;
				if(command.parameters.numbers && command.compareWith.indexOf("{NUMBER}") >= 0){
					interval = command.parameters.numbers[0];
				}

				this.freeRemoteSend(this.getFinalUrl() + i, callback);	
				this.repeatInterval = setInterval(() => {
					i++;
					this.freeRemoteSend(this.getFinalUrl() + i, callback);	
				}, interval * 1000);
				break;
			case "nouvelle_chaine":
				this.stopRepeatInterval();
				let key = ChaineDetecter.getKeyFromCommand(command);
				this.freeRemoteSend(this.getFinalUrl() + key, callback);
				break;
			case "lecture_pause": 
				this.stopRepeatInterval()
				this.freeRemoteSend(this.getFinalUrl() + "play", callback);
				break;
		}
	},

	stopRepeatInterval: function(callback){
		if(this.repeatInterval){
			clearInterval(this.repeatInterval);
		}
		if(callback){
			callback();
		}
	},

	freeRemoteSend : function(url, callback){
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function(){
        	if (xhr.readyState != 4) return;
			if (xhr.status != 200 && xhr.status != 304) {
				callback("ERROR");
			}
			callback && callback();
        }
        xhr.open('GET', url, true);
        xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');;
        xhr.send();
    }

};

module.exports = FreeboxCommander;