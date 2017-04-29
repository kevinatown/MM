/* global Module */

/* Magic Mirror
 * Module: MMM-Screencast
 *
 * By Kevin Townsend
 * {{LICENSE}} Licensed.
 */

Module.register("MMM-Screencast", {

	defaults: {
		width: 500,
		height: 300,
		url: '',
	},

	requiresVersion: "2.1.0", // Required version of MagicMirror

	start: function() {
		Log.info("Starting module: " + this.name);
		this.getYoutube();
	},

	getYoutube: function() {
		this.sendSocketNotification("INIT", this.config);
    },

    socketNotificationReceived: function(notification, payload) {
    	Log.info(notification, payload);
    	switch (notification) {
    		case 'SET-URL':
    			console.log('got the url on the front!!!');
	    		// var newurl = payload.split('/', -1);
	    		// console.log(newurl);
	    		// var newnew = 'http://youtube.com/embed/' + newurl[newurl.length - 1];
	    		// console.log(newnew);
	    		this.config.url = payload;
	    		this.updateDom();
	    		break;
	    	default:
	    		break;
    	}
    },

	getDom: function() {
		// var tag = document.createElement('script');
  // 		tag.src = "https://www.youtube.com/player_api";
		// var firstScriptTag = document.getElementsByTagName('script')[0];
		// firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

		// const div = document.createElement("div");
		// div.setAttribute("id", "player");
		// var player;
		// function onYouTubeIframeAPIReady() {
		// 	player = new YT.Player('player', {
		// 	  height: '390',
		// 	  width: '640',
		// 	  videoId: this.config.url,
		// 	  autoplay: 1,
		// 	  events: {
		// 	    'onReady': onPlayerReady,
		// 	    'onStateChange': onPlayerStateChange
		// 	  }
		// 	});
		// }
		// return div;
		const iframe = document.createElement("iframe");
		// iframe.options = "ALLOW-FROM: http://www.youtube.com/*";
		// iframe.sandbox="allow-scripts allow-popups allow-forms allow-top-navigation allow-same-origin";
		iframe.width = this.config.width;
		iframe.height = this.config.height;
		iframe.style = "border:0";
		iframe.src = "http://www.youtube.com/embed/"+this.config.url+"?autoplay=1";
		return iframe;
	}
});
