/**
 * Device utils
 * 
 * @class Box2.Device
 * @constructor
 */
Box2.Device = function(){

	var that = {};

	/**
	 * Device screen height
	 *
	 * @attribute height 
	 * @private
	 * @type Integer
	 */
	that.height = 0;

	/**
	 * Device screen width
	 *
	 * @attribute width 
	 * @private
	 * @type Integer
	 */
	that.width = 0;

	/**
	 * App heigth ( without status bar )
	 *
	 * @attribute innerHeight 
	 * @private
	 * @type Integer
	 */
	that.innerHeight = 0;

	/**
	 * App width ( without status bar )
	 *
	 * @attribute innerWidth 
	 * @private
	 * @type Integer
	 */
	that.innerWidth = 0;

	// Contructor
	this.__construct = function(){
		that.width = screen.width;
		that.height = screen.height;
		that.innerWidth = window.innerWidth;
		that.innerHeight = window.innerHeight;
		return this;
	};

	/**
	 * Get sizes 
	 *
	 * @method getSize
	 * @param type {String} Size for returns ( height, width, innerWidth or innerHeight )
	 * @return {Mixed} False if given an invalid type, Integer if is alright
	 **/
	this.getSize = function(type){
		if(that[type] !== undefined){
			return parseInt(that[type]);
		} else {
			return false;
		}
	};
	
	// Call the constructor
	return this.__construct.apply(this, arguments);
};
