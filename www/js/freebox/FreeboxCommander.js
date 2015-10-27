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
		switch(command.id){
			case "vol_inc":
			case "vol_dec":
				this.freeRemoteSend(this.getFinalUrl() + command.id, callback);
				break;
		}
	},

	freeRemoteSend : function(url, callback){
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function(){
            if (xhr.readyState === 4){
            	callback();
                // alert(xhr.responseText);
            }
        }
        xhr.open('GET', url, true);
        xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');;
        xhr.send();
    }

};

module.exports = FreeboxCommander;