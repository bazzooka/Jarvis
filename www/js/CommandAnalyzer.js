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

	listenCommand: function(){
		this.startRecognize(
			function(){
				console.log(arguments);
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