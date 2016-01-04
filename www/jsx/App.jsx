import React from 'react';
import Recognizer from './Recognizer.jsx';


var App = React.createClass({

	componentDidMount: function(){
		this.speak = function(text, queue = "false"){
			cordova.plugins.androidTTS.speak(
				function(){}, 
				function(){}, 
				text,
				queue
			);
		};
		
		console.log("Register for bootstrap");
		cordova.plugins.androidSMS.registerForBootStart(
			function(){
				console.log("success", arguments);
			},
			function(){
				console.log("fail", arguments);
			}
		)
		
	},

	render: function(){
		return (
			<div className="master-wrapper">
				<Recognizer />
			</div>
		)
	}
});

module.exports = App;