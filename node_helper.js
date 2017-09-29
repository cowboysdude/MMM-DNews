/* Magic Mirror
    * Module: MMM-DNews
    *
    * By Cowboysdude
    * 
    */
const NodeHelper = require('node_helper');
const request = require('request');
const parser = require('xml2js').parseString;

module.exports = NodeHelper.create({
	  
    start: function() {
    	console.log("Starting module: " + this.name);
    },
   
    getDnews: function(url) {
        request({ 
    	          url:  "http://feeds.nieuwsblad.be/nieuws/snelnieuws",
    	          method: 'GET' 
    	        }, (error, response, body) => {
            if (!error && response.statusCode === 200) {
                parser(body, (err, result)=> {
                    //if(result.hasOwnProperty('rss')){
                        var result = JSON.parse(JSON.stringify(result.rss.channel[0].item));
                        this.sendSocketNotification("DNEWS_RESULT", result);
                    //}
                });
            }
       });
    },

    //Subclass socketNotificationReceived received.
    socketNotificationReceived: function(notification, payload) {
        if (notification === 'GET_DNEWS') {
                this.getDnews(payload);
            }
         }  
    });