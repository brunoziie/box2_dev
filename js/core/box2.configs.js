/**
 * Controll application's configs
 * 
 * @static
 * @class Box2.Configs
 */
Box2.Configs = function(){

	var that = {};
	
	// Constructor	
	this.__construct = function(){
		return this;
	};

	/**
	 * Storage configs
	 * @private
	 * @attribute
	 * @type {Object}
	 */
	that.configs = {};
	
	/**
	 * Save a config
	 *
	 * @method write
	 * @param  {Strinh} key   Key name of config
	 * @param  {Mixed}  value Value for the config
	 * @return void
	 */
	this.write = function(key, value){
		that.configs[key] = value;
	};
	
	/**
	 * Read a saved config
	 *
	 * @method read
	 * @param  {String} key Key name of config
	 * @return {Mixed}  Config value
	 */
	this.read = function(key){
		return that.configs[key];
	};
	
	// Call the constructor
	return this.__construct.apply(this, arguments);
	
};

Box2.Configs = new Box2.Configs();
