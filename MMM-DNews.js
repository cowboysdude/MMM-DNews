/* Magic Mirror
    * Module: MMM-DNews
    *
    * By cowboysdude
    * 
    */
   
Module.register("MMM-DNews", {
       
        //requiresVersion: "2.1.0",
       
       // Module config defaults.
       defaults: {
           updateInterval: 60*1000, // every 10 minutes
           animationSpeed: 10,
           initialLoadDelay: 4950, // 0 seconds delay
           retryDelay: 1500,
           maxWidth: "80%",
           fadeSpeed: 11,
           rotateInterval: 20 * 1000, //20 seconds
           header: "Jouw nieuws"
           
       },
       
       // Define required scripts.
       getScripts: function() {
           return ["moment.js"];
       },
       
       getTranslations: function() {
        return {
            da: "translations/da.json"
        };
    },
       
       getStyles: function() {
           return ["MMM-DNews.css"];
       },

       // Define start sequence.
       start: function() {
           Log.info("Starting module: " + this.name);
           this.config.lang = this.config.lang || config.language;
           
           
           
           // Set locale.
           this.nascar = {};
           this.today = "";
           this.activeItem = 0;
           this.rotateInterval = null;
           this.scheduleUpdate();
       },
       
    processDnews: function(data) {
         this.news = data;
         this.loaded = true;
     },
     
    scheduleCarousel: function() {
       		console.log("Behandeling van nieuwsberichten");
	   		this.rotateInterval = setInterval(() => {
				this.activeItem++;
				this.updateDom(this.config.animationSpeed);
			}, this.config.rotateInterval);
	   },
     
     scheduleUpdate: function() {
         setInterval(() => {
             this.getDnews();
         }, this.config.updateInterval);
         this.getDnews(this.config.initialLoadDelay);
     },

     getDnews: function() {
         this.sendSocketNotification('GET_DNEWS');
     },

     socketNotificationReceived: function(notification, payload) {
         if (notification === "DNEWS_RESULT") {
             this.processDnews(payload);
             if(this.rotateInterval == null){
			   	this.scheduleCarousel();
			   }
               this.updateDom(this.config.animationSpeed);
         }
         this.updateDom(this.config.initialLoadDelay);
     },

      getDom: function() {

         var newsdiv = document.createElement("div");
           newsdiv.classList.add("light", "xsmall");
           newsdiv.style.maxWidth = this.config.maxWidth;
           
           var today = moment().format('M-D-YYYY');
          var wrapper = document.createElement("div");
          wrapper.classList.add("open");
          
		   var header = document.createElement("header");
          header.innerHTML = this.config.header;
          wrapper.appendChild(header);	
		
		  
          if (!this.loaded) {
             wrapper.classList.add("wrapper", "open");
             wrapper.innerHTML = "Behandeling van nieuwsberichten...";
             wrapper.className = "bright light small";
             return wrapper;
			}  

          var keys = Object.keys(this.news);
              if (keys.length > 0) {
            if (this.activeItem >= keys.length) {
                this.activeItem = 0;
           }
           var news = this.news[keys[this.activeItem]];
        
         
         var newsLogo = document.createElement("div");
         var newsIcon = document.createElement("img");
         newsIcon.src = news.enclosure[0].$.url;
         newsIcon.classList.add("imgDes");
         newsLogo.appendChild(newsIcon);
         wrapper.appendChild(newsLogo);
         
         
         var dateString=news.pubDate;
		 dateString=new Date(dateString).toUTCString();
		 dateString=dateString.split(' ').slice(0, 4);
		 dateArr = this.translate(dateString[0]) +" "+ dateString[1] + " "+this.translate(dateString[2]);
         
         
         var Ddate = document.createElement("h3");
         Ddate.classList.add("small", "bright");
		 Ddate.innerHTML = dateArr+ "<BR>";	
         wrapper.appendChild(Ddate);
         
         var title = document.createElement("h3");
         title.classList.add("small", "bright");
		 title.innerHTML = news.title;	
         wrapper.appendChild(title);
         
           
        var des = document.createElement("p");
        des.classList.add("xsmall", "bright", "p");
        des.innerHTML = news.description;
        wrapper.appendChild(des);
          
			}
			return wrapper;
			},
     
     
 });