module.exports = NodeHelper.create({
	dialServer: require("./DialServer.js"),
	config: {},

	start: function() {
		console.log('config', this.config);
		// this.io.on('connection', function(socket){
		// 	console.log('socket connected');
		// 	socket.emit('connected');
  // 			socket.on('seturl', function(data) { 
  // 				console.log('seturl! in connected', data);
  // 				this.sendSocketNotification("SET-URL", data);
  // 				// this.sendSocket
		// 	}.bind(this));
		// }.bind(this));
	},

	sendSocket: function(url) {
		console.log('attempting to get url', s.getUrl);
		this.sendSocketNotification("SET-URL", url);
	},

	socketNotificationReceived: function(notification, payload) {
		console.log(notification, payload);
		switch (notification) {
			case 'SET_CONFIG':
				this.config = payload;
				this.dialServer.start(payload);
				break;
			default:
				break;
		}
	}
});
