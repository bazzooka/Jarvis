//var Commands = require('./Commands.js');

var CommandAnalyzer = {
	startRecognize: cordova.plugins.androidSpeech.startRecognize,

	listenCommand: function(){
		startRecognize(function(){console.log(arguments);}, function(){console.log(arguments);}, 0, "Test", "fr-FR")
	}
};

module.exports = CommandAnalyzer;