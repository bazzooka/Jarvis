import React from 'react';
import CommandAnalyzer from '../js/CommandAnalyzer';

let Recognizer = React.createClass({
	componentDidMount: function(){
		CommandAnalyzer.init();
		document.getElementById('recognize-button').addEventListener("click", function(e){
			CommandAnalyzer.listenCommand();
		});

		CommandAnalyzer.debugCompareOrder("A quelle heure est le prochain train pour Enghien les Bains depuis Paris ?");
	},

	render: function(){
		return(
			<div className="recognizer-container">
				<div id="recognize-button" className="recognize-button">PEPPER</div>
			</div>
		)

	}
});

module.exports = Recognizer;
