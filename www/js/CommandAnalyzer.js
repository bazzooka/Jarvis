import FreeboxCommander from './freebox/FreeboxCommander';

var CommandAnalyzer = {
	startRecognize: cordova.plugins.androidSpeech.startRecognize,
	speak: cordova.plugins.androidTTS.speak,
	commands: [],

	init: function(){
		this.loadPlugins();
	},

	loadPlugins: function(){
		this.commands.push(FreeboxCommander.getCommands());
	},

	compareSpeaksAgainstCommands: function(orders){
		for(var i = 0, l = orders.length; i < l ; i++){
			for(var j = 0, n = this.commands.length; j < n; j++){
				
			}
		}
	},

	listenCommand: function(){
		this.startRecognize(
			(commands) => {
				this.compareSpeaksAgainstCommands(orders);
			}, 
			function(){
				console.log(arguments);
			}, 
			0, 
			"Test", 
			"fr-FR"
		);
	}
};

module.exports = CommandAnalyzer;