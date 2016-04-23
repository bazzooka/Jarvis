import request from 'superagent';
import FreeboxCommander from './freebox/FreeboxCommander';
import SncfCommander from './sncf/SncfCommander';

import api_auth from './api_ai_auth';
const API_AI_BASE_URL= 'https://api.api.ai/api/';

var CommandAnalyzer = {

	commands: [],
	plugins: [],
	lastCommand: {},

	init: function(){
		this.loadPlugins();
		this.startRecognize = !window.isDesktop && cordova.plugins.androidSpeech.startRecognize,
		this.speak = null;
		if(window.isDesktop){
			this.speak = (text, queue, success, error) => {
				setTimeout(()=>{
					console.log("Speak", text, "queue", queue);
					success();
				}, 1000);
			}
		} else {
			this.speak = (text, queue = "false", success, error) => {
				cordova.plugins.androidTTS.speak(
					success,
					error,
					text,
					queue
				);
			}
		}
	},

	loadPlugins: function(){
		// Freebox
		let freeboxPlugin = FreeboxCommander.loadPlugin();
		this.commands = this.commands.concat(freeboxPlugin.commands);
		this.plugins[freeboxPlugin.module] = FreeboxCommander;

		// SNCF
		const sncfPlugin = SncfCommander.loadPlugin();
		this.commands = this.commands.concat(sncfPlugin.commands);
		this.plugins[sncfPlugin.module] = SncfCommander;
	},

	compareSpeaksAgainstCommands: function(orders){
		let resultats = [];
		for(var i = 0, l = orders.length; i < l ; i++){
			let order = orders[i].toLocaleLowerCase();
			for(var j = 0, n = this.commands.length; j < n; j++){
				let currentCommand = this.commands[j].commandes;
				for(var k = 0, p = currentCommand.length; k < p; k++){
					let words = currentCommand[k],
					commandeScore = {com: this.commands[j], score: 0, parameters: {}, compareWith: words.join(" "), order: order};
					for(var x = 0, xl = words.length; x < xl; x++){
						let word = words[x].toLocaleLowerCase();
						// Detect number parameter
						if( word === '{number}'){
							let numberParams = order.match(/\d+/gi);
							if(numberParams){
								commandeScore.parameters.numbers = numberParams;
								commandeScore.score++;
							}
						} else if( word === '{text}') {	// detect word between other words
							const wordBefore = x > 0 ? `(?:${words[x-1]}?)` : '(?:^)';
							const wordAfter = x < xl - 1 ? `(?:${words[x+1]}?)` : '(?:[$\?\.,\!])';
							const regXP = new RegExp(`${wordBefore}(.*)${wordAfter}`, 'i');
							const numberParams = order.match(regXP);
							if(numberParams && numberParams.length === 2){
								const keepText = numberParams[1].trim();
								commandeScore.parameters.text = commandeScore.parameters.text ? commandeScore.parameters.text.concat([keepText]) : [keepText];
								commandeScore.score++;
							}

						}
						else if(order.indexOf(word) >= 0){
							commandeScore.score++;
						}
					}

					// Add a point if this command has lastCommand id for parent
					if(commandeScore.score > 0 && (this.commands[j].parent && this.lastCommand.command && this.commands[j].parent === this.lastCommand.command.com.id)){
						commandeScore.score++;
					}

					// If BestScore => Augment score

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
				this.lastCommand = {command: command};
				this.plugins[module].executeCommande(command, command.order, (error, resultat) =>{
					if(error){
						this.speak("Désolé monsieur, mais une erreur est survenue.", true);
					} else if(command.com.validation){
						let confirmSpeak = command.com.validation[Math.floor(Math.random() * command.com.validation.length)];
						this.speak(confirmSpeak, true);
					} else if(typeof (resultat) === 'string'){
						console.log(resultat);
						this.speak(resultat, true);
					} else if(typeof(resultat) === 'object'){
						// TODO A REVOIR
						if(resultat.isNextStep){
							console.log("IsNextStep")
						}
					}
				});
			}
		}
	},

	getMeaning: function(orders) {
		request
			.get(`${API_AI_BASE_URL}/query`)
			.set({Authorization: api_auth.authorization, 'ocp-apim-subscription-key' : api_auth.key})
			.query({v: api_auth.version})
			.query({query : orders[0]})
			.query({lang: 'fr'})
			.query({timezone: 'Europe/Paris'})
			.end((err, res) => {
				if(err){
					this.speak("Désolé monsieur, mais une erreur est survenue.", true);
				} else {
					const body = res.body;
					if(body.result.actionIncomplete) {
						console.log(body);
						this.speak(body.result.fulfillment.speech, true, ()=> {
							// TODO Callback quand la lecture de la phrase est terminée
							// TODO Listen à nouveau
							this.listenCommandAI();
						});


					} else {
						// TODO Suivant intent et params exécuter action
						console.log(body);
					}
				}
			})
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
	},

	listenCommandAI: function(){
		let me = this;
		this.startRecognize(
			(orders) => {
				me.getMeaning(orders);
				// this.compareSpeaksAgainstCommands(orders);
				//this.speak(function(){}, function(){}, commands[0]);
			},
			function(){
				console.log(arguments);
			},
			0,
			"Test",
			"fr-FR"
		);
	},

	debugCompareOrder: function(order){
		this.getMeaning([order]);
	}
};

module.exports = CommandAnalyzer;
