var dial = require("peer-dial");
var http = require('http');
var express = require('express');
var { spawn } = require('child_process');
var ipc = require('node-ipc');
ipc.config.id = 'screenCastDIAL';
ipc.config.retry = 1000;
var app = express();
var server = http.createServer(app);
var PORT = 8569;
// var PORT = 8080;
var MANUFACTURER = "Kevin Townsend";
var MODEL_NAME = "DIAL Server";
var mainWindow;
var child = null;

var apps = {
	"YouTube": {
		name: "YouTube",
		state: "stopped",
		allowStop: true,
		pid: null,
	    launch: function (launchData, config) {
	        var url = "http://www.youtube.com/tv?"+launchData;
	        var args = [ url, config.position, config.width, config.height].join(' ');
	        // child = exec("cd modules/MMM-Screencast; npm start "+"'"+args+"'");
	        child = spawn('npm', ['start', url, config.position, config.width, config.height], {
  				cwd: 'modules/MMM-Screencast'
			})
			child.stdout.on('data', function(data) {
			    console.log('screencast stdout: ' + data);
			});
			child.stderr.on('data', function(data) {
			    console.log('screencast stderr: ' + data);
			});
			child.on('close', function(code) {
			    console.log('closing code: ' + code);
			});
    	}
	}
};

var dialServer = new dial.Server({
// module.exports = new dial.Server({
	corsAllowOrigins: true,
	expressApp: app,
	port: PORT,
	prefix: "/dial",
	manufacturer: MANUFACTURER,
	modelName: MODEL_NAME,
	launchFunction: null,
	electronConfig: {},
	extraHeaders: {
		"x-frame-options": "GOFORIT"
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
                app.launch(lauchData, dialServer.electronConfig);
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
				ipc.connectTo('screenCastWindow',() => {
    				ipc.of.screenCastWindow.on('connect',() => {
                		ipc.of.screenCastWindow.emit('quit');
            		});
            		ipc.of.screenCastWindow.on('quit', () => {
            			ipc.disconnect('screenCastWindow');
            		});
    			});
    			child = null;
				callback(true);
			}
			else {
				callback(false);
			}
		}
	}
});

var App = function() {
	// app.use("/", function(res,request,))
	this.config = {};

	this.server = http.createServer(app);

	this.start = function(mainWindowCallback, config) {
		mainWindow = mainWindowCallback();
		console.log(mainWindow);
		dialServer.electronConfig = config;
		this.server.listen(PORT,function(){
			dialServer.start();
			console.log("DIAL Server is running on PORT "+PORT);
		});
	};

};


module.exports = new App();
