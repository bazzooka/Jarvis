import React from 'react';
import Recognizer from './Recognizer.jsx';


var App = React.createClass({

	render: function(){
		return (
			<div className="master-wrapper">
				<Recognizer />
			</div>
		)
	}
});

module.exports = App;