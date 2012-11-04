/**
 * Mapper class
 * 
 * @static
 * @class Box2.Mapper
 */

Box2.Mapper = function(){
	
	// Constructor
	this.__construct = function(){
		return this;
	};

	/**
	 * Parse a given URL and returns a object with your controller, action and arguments
	 *
	 * @method parse
	 * @param  {String} href URL for parse
	 * @return {Object}      Object with controller, action and arguments 
	 **/	
	this.parse = function(href){
		if(typeof href == 'undefined' || href == '' ){
			href = '#/home';
		};

		var regex = /#(.+)/,
			queryString = href.match(regex),
			path, 
			param, 
			len,
			mapperData = {};

		if(queryString != null) {
			if(queryString.length > 1) {
				path = queryString[1];
			}
		} else {
			path = '/home'
		}

		path = path.replace(/\/$/, '').replace(/\.\w+$/, '');			

		if(path.substr(0,1) != "/"){
			path = '/' + path;
		};

		if(path == '/#' || path == '/' || path == '/index') {
			path = '/home';
		};

		param = path.split('/');
		len = param.length - 1;

		if(len > 0) {
			param.splice(0, 1);
		};

		if (len == 0) {
			mapperData.controller = 'home';
			mapperData.action = 'index';
			mapperData.args = [];
		} else if(len == 1) {
			mapperData.controller = param[0].toLowerCase();
			mapperData.action = 'index';
			mapperData.args = [];
		} else if(len == 2){
			mapperData.controller = param[0].toLowerCase();
			mapperData.action = param[1].toLowerCase().replace(/_+/gm, '');
			mapperData.args = [];
		} else if(len >= 3) {
			mapperData.controller = param[0].toLowerCase();
			mapperData.action = param[1].toLowerCase().replace(/_+/gm, '');
			mapperData.args = param.splice(2, param.length - 1);
		}

		return mapperData;		
	};
	
	// Call the constructor
	return this.__construct.apply(this, arguments);
};

Box2.Mapper = new Box2.Mapper();
