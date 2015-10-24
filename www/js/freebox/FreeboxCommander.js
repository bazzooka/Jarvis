import commands from './commands.json';

let FreeboxCommander = {
	baseUrl : "http://hd1.freebox.fr/pub/remote_control?code=",
	code: "50914410",
	interval: null,

	getFinalUrl : function(){
		return (this.baseUrl + this.code + "&key=");
	},

	getCommands: function(){
		return commands;
	},

	sendCommand: function(callback, key, repeat = 1){
		this.interval && clearInterval(this.interval);

		if(repeat > 1){
			this.interval = setInterval(() => {
				console.log("Execute command %s", key);
				this.sendCommand(callback, key, repeat--);
			}, 50);
		} else {
			this.sendCommand(callback, key, repeat--);
		}
	},

	decVol: function(callback, qty = 2){
		this.sendCommand(callback, "vol_dec", qty);
	},

	incVol: function(callback, qty = 2){
		this.sendCommand(callback, "vol_inc", qty);
	}

};

module.exports = FreeboxCommander;