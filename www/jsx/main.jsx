// import React from 'react';
// import ReactDOM from 'react-dom';
// import App from './App.jsx';

var React = require('react');
var ReactDOM = require('react-dom');
var App = require('./App.jsx');

document.addEventListener('deviceready', function(){
	ReactDOM.render(
	    <App/>, 
	    document.getElementById("container")
	);
}, false);

