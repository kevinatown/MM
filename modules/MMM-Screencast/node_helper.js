var NodeHelper = require("node_helper");
var dial = require("peer-dial");
var opn = require("opn");
// var cors = require('cors');
var express = require('express');
// var apps = {
// 	"YouTube": {
// 		name: "YouTube",
// 		state: "stopped",
// 		allowStop: true,
// 		pid: null,
    
//     // additionalData: {
//     //     "ex:key1":"value1",
//     //     "ex:key2":"value2"
//     // },
//     // namespaces: {
//     //    "ex": "urn:example:org:2014"
//     // }
// 	    launch: function (launchData, f) {
// 	    	// console.log('in launch function', launchData, f);
// 	        opn("http://www.youtube.com/tv?"+launchData);
// 	        f("http://www.youtube.com/tv?"+launchData);
// 	    }
// 	}
// };
module.exports = NodeHelper.create({
	dialServer: require("./DialServer.js"),

	start: function() {
		// this.expressApp.use(cors());
		// var dialServer = new dial.Server({
		// 	corsAllowOrigins: "*",
		// 	expressApp: this.expressApp,
		// 	port: 8080,
		// 	prefix: "/dial",
		// 	manufacturer: "Kevin Townsend",
		// 	modelName: "DIAL SERVER",
		// 	launchFunction: this.sendSocket,
		// 	/*extraHeaders: {
		// 		"X-MY_HEADER": "My Value"
		// 	},*/
		// 	delegate: {
		// 		getApp: function(appName){
		// 			var app = apps[appName];
		// 			return app;
		// 		},
				
		// 		launchApp: function(appName,lauchData,callback){
		// 			// console.log("Got request to launch", appName," with launch data: ", lauchData);
		// 			// console.log("inside launchApp", this.launchFunction, dialServer.launchFunction)
		// 			var app = apps[appName];
		// 			var pid = null;
		// 			if (app) {
		// 				app.pid = "run";
		// 				app.state = "starting";
		//                 app.launch(lauchData, dialServer.launchFunction);
		//                 // dialServer.launchFunction("http://www.youtube.com/tv?"+lauchData);
		//                 app.state = "running";
		// 			}
		// 			callback(app.pid);
		// 		},
		// 		stopApp: function(appName,pid,callback){
		//             console.log("Got request to stop", appName," with pid: ", pid);
		// 			var app = apps[appName];
		// 			if (app && app.pid == pid) {
		// 				app.pid = null;
		// 				app.state = "stopped";
		// 				callback(true);
		// 			}
		// 			else {
		// 				callback(false);
		// 			}
		// 		}
		// 	}
		// }, this);
		// console.log();
		// this.server = express();
		// this.server.listen('8080',dialServer.start();
		// console.log(dialServer);
		// console.log(this.expressApp);
		// this.expressApp.use(dialServer.start());
		// this.expressApp.use('/dial', function(){dialServer.start(); console.log("DIAL Server is running on PORT ");});

			// dialServer.start();
		// ).bind(this);
		// this.dialServer.port = 8080;
		// this.expressApp.use(this.dialServer);
		this.dialServer.start();
		this.io.on('connection', function(socket){
			console.log('socket connected');
			socket.emit('connected');
  			socket.on('seturl', function(data) { 
  				console.log('seturl! in connected', data);
  				this.sendSocketNotification("SET-URL", data);
  				// this.sendSocket
			}.bind(this));
		}.bind(this));
	},

	sendSocket: function(url) {
		console.log('attempting to get url', s.getUrl);
		this.sendSocketNotification("SET-URL", url);
	},

	socketNotificationReceived: function(notification, payload) {
		console.log(notification, payload);
	}
});
