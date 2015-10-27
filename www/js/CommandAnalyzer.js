import FreeboxCommander from './freebox/FreeboxCommander';

var CommandAnalyzer = {
	
	commands: [],
	plugins: [],

	init: function(){
		this.loadPlugins(); 
		this.startRecognize = cordova.plugins.androidSpeech.startRecognize,
		this.speak = function(text, queue = "false"){
			cordova.plugins.androidTTS.speak(
				function(){}, 
				function(){}, 
				text,
				queue
			);
		};
	},

	loadPlugins: function(){
		let freeboxPlugin = FreeboxCommander.loadPlugin();
		this.commands = this.commands.concat(freeboxPlugin.commands);
		this.plugins[freeboxPlugin.module] = FreeboxCommander;
	},

	compareSpeaksAgainstCommands: function(orders){
		let resultats = [];
		for(var i = 0, l = orders.length; i < l ; i++){
			let order = orders[i].toLocaleLowerCase();
			for(var j = 0, n = this.commands.length; j < n; j++){
				let currentCommand = this.commands[j].commandes;
				for(var k = 0, p = currentCommand.length; k < p; k++){
					let words = currentCommand[k],
					commandeScore = {com: this.commands[j], score: 0, compareWith: words.join(" "), order: order};
					for(var x = 0, xl = words.length; x < xl; x++){
						if(order.indexOf(words[x].toLocaleLowerCase()) >= 0){
							commandeScore.score++;
						}
					}
					resultats.push(commandeScore); 
				}
				
			}
		}
		this.sortResultats(resultats);
	},

	sortResultats: function(commandesScore){
		let bestResult = [],
			bestScore = 0,
			isMultipleCommand = false;
		for(var i = 0, l = commandesScore.length; i < l ; i++){
			if(commandesScore[i].score > bestScore){
				bestResult= [];
				bestResult[commandesScore[i].com.id] = commandesScore[i];
				bestScore = commandesScore[i].score;
				isMultipleCommand = false;
			} else if(commandesScore[i].score === bestScore && !bestResult[commandesScore[i].com.id]){
				isMultipleCommand = true;
				bestResult[commandesScore[i].com.id] = commandesScore[i];
			}
		}
		if(bestScore === 0){
			this.speak("Désolé monsieur, je n'ai pas compris");
		} else if(isMultipleCommand){
			this.speak("Que voulez-vous faire, vous avez plusieurs possibilité et je dirais même plus ?");
			this.speak("Que voulez-vous faire ?", "true");
		} else {
			for(var com in bestResult){
				if(bestResult.hasOwnProperty(com)){
					this.executeCommand(bestResult[com]);
					break;
				}
			}
		}
	},

	executeCommand: function(command){
		for(var module in this.plugins){
			if(this.plugins.hasOwnProperty(module) && module === command.com.module){
				this.plugins[module].executeCommande(command.com, command.order, function(){
					console.log("everything is ok");
				});
			}
		}
	},

	listenCommand: function(){
		this.startRecognize(
			(orders) => {
				this.compareSpeaksAgainstCommands(orders);
				//this.speak(function(){}, function(){}, commands[0]);
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