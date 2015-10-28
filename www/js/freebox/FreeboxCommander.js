import commands from './commands.json';

let FreeboxCommander = {
	baseUrl : "http://hd1.freebox.fr/pub/remote_control?code=",
	code: "50914410",
	repeatInterval : null,

	getFinalUrl : function(){
		return (this.baseUrl + this.code + "&key=");
	},

	loadPlugin: function(){
		return {
			commands : commands.commandes,
			callback: this.sendCommand,
			module: "freebox"
		}
	},

	// sendCommand: function(callback, key, repeat = 1){
	executeCommande: function(command, order, callback){
		switch(command.com.id){
			case "vol_inc":
			case "vol_dec":
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
			callback();
        }
        xhr.open('GET', url, true);
        xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');;
        xhr.send();
    }

};

module.exports = FreeboxCommander;