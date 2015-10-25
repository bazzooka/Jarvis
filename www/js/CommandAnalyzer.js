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