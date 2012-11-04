/**
 * AJAX utils
 * 
 * @class Box2.Ajax
 * @constructor
 * @param async {Boolean} True if will to use async request
 */
Box2.Ajax = function(){
	
	var that = {};
	
	/**
	 * Storage XMLHttpRequest object
	 * @private
	 * @attribute link
	 * @type Object 
	 */
	that.link = null;

	/**
	 * Set if the request will to be async
	 * @private
	 * @attribute async
	 * @type Boolean 
	 */
	that.async = false;
	
	// Contructor
	this.__construct = function(async){
		that.async = async || false;
		that.link = new XMLHttpRequest();
		return this;
	};
	
	/**
	 * Send a HTTP request
	 * 
	 * @method request
	 * @param  {String} url     Url to send the request
	 * @param  {String} method  Method of the request <POST|GET>
	 * @return {String}         Result of the request or a empty string if to happen some error
	 */
	this.request = function(url, method, params){
		var queryString;
		method = method || "GET";
		params = params || {};
		queryString = that.__parseParams(params);

		try{
			that.link.open(method, url, that.async);
			if(method == 'POST' && queryString != ''){
				that.link.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
			};
			that.link.send();
			return that.link.responseText;			
		} catch(e) {
			return '';
		}
	};
	
	/**
	 * Mount a querystring from a object
	 * 
	 * @private
	 * @method __parseParams
	 * @param  {Object} params List of params
	 * @return {String}        Querystring with the params
	 */
	that.__parseParams = function(params){
		var parts = [], i;

		for(i in params) {
			if(params.hasOwnProperty(i)) {
				parts.push(encodeURIComponent(i) + "=" + encodeURIComponent(params[i]));
			}
		}

		return parts.join("&");
	}

	// Call the constructor
	return this.__construct.apply(this, arguments);
};
