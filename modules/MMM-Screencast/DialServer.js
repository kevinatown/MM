var dial = require("peer-dial");
var http = require('http');
var express = require('express');
var opn = require("opn");
var app = express();
// var io = require('socket.io');
var io = require('socket.io-client');
var events = require('events');
var serverEmitter = new events.EventEmitter();
var server = http.createServer(app);
var PORT = 8569;
// var PORT = 8080;
var MANUFACTURER = "Kevin Townsend";
var MODEL_NAME = "DIAL Server";
var apps = {
	"YouTube": {
		name: "YouTube",
		state: "stopped",
		allowStop: true,
		pid: null,
    /*
    additionalData: {
        "ex:key1":"value1",
        "ex:key2":"value2"
    },
    namespaces: {
       "ex": "urn:example:org:2014"
    }*/
	    launch: function (launchData, f) {
	    	// console.log('in launch function', launchData, f);
	        // opn("http://www.youtube.com/tv?"+launchData);
	        console.log(launchData);
	        // let vid = launchData.split('v=');
	        // console.log(vid);
	        // vid = vid.length > 0 ? vid[1].split('&')[0] : '';
	        // f("http://www.youtube.com/tv?"+launchData);
	        // f(vid);
	        f("https://www.youtube.com/tv?"+launchData);
    	}
	}
};
var dialServer = new dial.Server({
// module.exports = new dial.Server({
	corsAllowOrigins: "*",
	expressApp: app,
	port: PORT,
	prefix: "/dial",
	manufacturer: MANUFACTURER,
	modelName: MODEL_NAME,
	launchFunction: null,
	extraHeaders: {
		"x-frame-options": "ALLOW-FROM: *"
	},
	delegate: {
		getApp: function(appName){
			var app = apps[appName];
			return app;
		},
		
		launchApp: function(appName,lauchData,callback){
			// console.log("Got request to launch", appName," with launch data: ", lauchData);
			// console.log("inside launchApp", this.launchFunction, dialServer.launchFunction)
			var app = apps[appName];
			var pid = null;
			if (app) {
				app.pid = "run";
				app.state = "starting";
                app.launch(lauchData, dialServer.launchFunction);
                // dialServer.launchFunction("http://www.youtube.com/tv?"+lauchData);
                app.state = "running";
			}
			callback(app.pid);
		},
		stopApp: function(appName,pid,callback){
            console.log("Got request to stop", appName," with pid: ", pid);
			var app = apps[appName];
			if (app && app.pid == pid) {
				app.pid = null;
				app.state = "stopped";
				dialServer.launchFunction('');
				callback(true);
			}
			else {
				callback(false);
			}
		}
	}
});

var App = function() {
	this.server = http.createServer(app);

	this.start = function() {
		var socket = io.connect('http://localhost:8080', {reconnect: true});
		socket.on('connected', function() { 
  			console.log('Connected!');
		});
		const setUrl = function(url) {
			socket.emit('seturl', url);
			console.log('seturl', url);
		};
		
		dialServer.launchFunction = setUrl;
		this.server.listen(PORT,function(){
			dialServer.start();
			console.log("DIAL Server is running on PORT "+PORT);
		});
	};

};


module.exports = new App();
