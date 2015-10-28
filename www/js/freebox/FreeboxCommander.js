import commands from './commands.json';

let FreeboxCommander = {
	baseUrl : "http://hd1.freebox.fr/pub/remote_control?code=",
	code: "50914410",

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
			case "power":
				this.freeRemoteSend(this.getFinalUrl() + command.com.id, callback);
				break;
		}
	},

	freeRemoteSend : function(url, callback){
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function(){
            if (xhr.readyState === 4){
            	if (req.readyState != 4) return;
    			if (req.status != 200 && req.status != 304) {
    				alert('HTTP error ' + req.status);
    				return;
    			}
    			callback();
            }
        }
        xhr.open('GET', url, true);
        xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');;
        xhr.send();
    }

};

module.exports = FreeboxCommander;