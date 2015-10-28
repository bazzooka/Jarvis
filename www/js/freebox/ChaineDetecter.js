let ChaineDetecter = {
	chaines : {
		"tf1": "1",
		"france 2": "2",
		"france 3": "3",
		"france 5": "5",
		"m6": "6",
		"arte": "7",
		"d8": "8",
		"w9": "9",
		"tmc": "10",
		"nt1": "11",
		"nrj12": "12",
		"lcp": "13",
		"france 4": "14",
		"BFM": "15",
		"i-Télé": "16",
		"d17": "17",
		"gulli": "18",
		"france ô": "19",
		"hd1": "20",
		"équipe 21": "21",
		"sister": "22",
		"chéri 25": "25",
		"rtl 9": "28",
		"ab 1": "39"
	},

	getKeyFromCommand: function(command){
		let instruction = command.compareWith.toLocaleLowerCase();

		for(let chaine in this.chaines){
			if(this.chaines.hasOwnProperty(chaine)){
				if(instruction.indexOf(chaine) >= 0){
					return this.chaines[chaine];
				}
			}
		}
	}
};

module.exports = ChaineDetecter;