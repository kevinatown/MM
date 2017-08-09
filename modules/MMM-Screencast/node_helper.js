module.exports = NodeHelper.create({
	dialServer: require("./DialServer.js"),
	config: {},

	start: function() {
		// console.log(this);
		// console.log('config', this.config)
	},

	socketNotificationReceived: function(notification, payload) {
		console.log(notification, payload);
		switch (notification) {
			case 'SET_CONFIG':
				this.config = payload;
				this.dialServer.start(this.mainWindow, payload);
				console.log(this.mainWindow());
				break;
			default:
				break;
		}
	}
});
