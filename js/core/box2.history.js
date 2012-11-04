/**
 * Controll application navigation history
 * 
 * @static
 * @class Box2.History
 */
Box2.History = function(){
	
	var that = {};

	/**
	 * Storage the history
	 * @private
	 * @attribute historyList
	 * @type Array
	 */
	that.historyList = [];

	// Constructor	
	this.__construct = function(){
		return this;
	};

	/**
	 * Add a path to history
	 * 
	 * @method add
	 * @param {String} string Path for save
	 * @return void
	 */
	this.add = function(string){
		if(that.historyList.length > 0){
			if(this.current() != string){
				that.historyList.push(string);				
			}
		}else if(that.historyList.length == 0){
			that.historyList.push(string);
		}
	};

	/**
	 * Remove last history path
	 * 
	 * @method removeLast
	 * @return void 
	 */
	this.removeLast = function(){
		var length = this.length();
		that.historyList.splice(length - 1, 1);
	};

	/**
	 * Get current path
	 * 
	 * @method current
	 * @return {String} Current path
	 */
	this.current = function(){
		var length = this.length(),
			index = 0;

		if(length > 0){
			index = length - 1;
		}
	
		return that.historyList[index];
	};

	/**
	 * Get previous path
	 * 
	 * @method prev
	 * @return {String} Previous path
	 */
	this.prev = function(){
		var length = this.length(),
			index = 0;

		if(length > 0 && (length - 2) > 0){
			index = length - 2;
		}
	
		return that.historyList[index];
	};

	/**
	 * Get length of history array
	 * 
	 * @method length
	 * @return {Integer} History length
	 */
	this.length = function(){
		return that.historyList.length;
	};

	/**
	 * Clear the history
	 * 
	 * @method reset
	 * @return void
	 */
	this.reset = function(){
		that.historyList = [];
	};

	// Call the constructor
	return this.__construct.apply(this, arguments);
};

Box2.History = new Box2.History();
