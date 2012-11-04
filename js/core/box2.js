// Box2 v0.1 beta - Javascript MVC Framework for Android PhoneGap
//
// @license http://www.opensource.org/licenses/mit-license.php The MIT License
// @copyright Copyright 2012, Box2 - Framework (http://box2.pagodabox.com/)
// @author: Bruno Silva | eu@brunoziie.com

/**
 * Framework Core
 *
 * @static
 * @class Box2
 **/
var Box2 = function(){	

	// Constructor
	this.__construct = function() {
		// Start namespace of the application
		this.namespace('Models');
		this.namespace('Views');
		this.namespace('Layouts');
		this.namespace('Controllers');
		this.namespace('Components');
		this.namespace('Helpers');
		this.namespace('Datasource');

		return this;
	}
	
	/**
	 * Initialize de application
	 * 
	 * @method bootUp
	 * @return void
	 */
	this.bootUp = function(){
		var that = this,
			navigator = window.navigator;

		// Loads AppController
		that.Loader.controller({controller:'app'}, null);

		// Apply event to hash change		
		window.addEventListener('hashchange', function(){
			var hash = window.location.hash.replace(/\.\w+$/, ''),
				data = that.Mapper.parse(hash),
				prev = that.Mapper.parse(that.History.prev()),
				postData = that.Forms.getPostData();
		
			if(postData.length > 0){
				that.Forms.resetPostData();
			}
		
			if(that.History.current() != hash && that.History.prev() != hash){
				that.History.add(hash);
			}

			that.Loader.controller(data, postData);
			return false;
		
		}, false);

		// Override backbutton event
		document.addEventListener('backbutton', function (){
			var prev;
			
			if(that.History.length() > 1){
				prev = that.History.prev();
				that.History.removeLast();
				window.location.hash = prev;
			}else{
				console.log(navigator);
				navigator.app.exitApp();
			}
		
			return false;
		});

		// Init application
		window.location.hash = '#/home/index';
		
	};
	
	/**
	 * Implements a extends utils
	 * 
	 * @method extend
	 * @param  {Object}   obj    Object that will to be extended
 	 * @param  {Function} target New object implementation
 	 * @return {Object}          New object 
	 */	
	this.extend = function(obj, target){
		var _parent = function(){};
		_parent.prototype = (typeof obj == 'function') ? new obj : obj ;
		target.prototype = new _parent;
		return new target;
	};
	
	/**
	 * Merge two objects
	 * 
	 * @method merge
	 * @param  {Object} a First Object
 	 * @param  {Object} b Second Object
 	 * @return {Object}   Merge of the two objects
	 */
	this.merge = function(a, b){
		var objA = function(){},
			objB = function(){};

			objA.prototype = a;
			objB.prototype = b;
	  
	    var x = new objA,
	    	y = new objB,
	    	objC = {},
	    	attrname;
	  
	    for(attrname in x) { objC[attrname] = x[attrname]; }
	    for(attrname in y) { objC[attrname] = y[attrname]; }
	
	    return objC; 
	};

	/**
	 * Get length of a object
	 * 
	 * @method objlen
	 * @param  {Object} obj Object that you want get the length
	 * @return {Number}     Length of the object
	 */
	this.objlen = function(obj) {
	    var size = 0, 
	    	key;

	    for (key in obj) {
	        if (obj.hasOwnProperty(key)) {
	        	size++;	
	        }
	    }

	    return size;
	};

	/**
	 * Destroy a reference from a object
	 * 
	 * @method getObject
	 * @param  {Object} obj Object that you want to get without parent reference
	 * @return {Object}     New object without the parent reference
	 **/
	this.getObject = function(obj){
		var out = function(){};
		out.prototype = obj;
			
		return new out();
	};
	
	/**
	 * Add slashes to a string
	 * 
	 * @method addSlashes
	 * @param  {String} str String for escape
	 * @return {String}     Escaped string
	 */
	this.addSlashes = function(str){
		// Original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
		return (str + '').replace(/[\\"']/g, '\\$&').replace(/\u0000/g, '\\0');
	};

	/**
	 * Remove slashes from a string
	 * 
	 * @method stripSlashes
	 * @param  {String} str String that contains slashes
	 * @return {String}     String without slashes
	 */
	this.stripSlashes = function(str){
		// Original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
		return (str + '').replace(/\\(.?)/g, function (s, n1) {
			switch (n1) {
				case '\\':
					return '\\';
				case '0':
					return '\u0000';
				case '':
					return '';
				default:
					return n1;
			}
		});
	};

	/**
	 * Implements namespacing
	 * 
	 * @method namespace
	 * @param  {String} path Namespacing path
	 * @return void
	 */
	this.namespace = function(path){
		var parts = path.split('/'),  
			parent = this,  
			pl = parts.length, 
			i;
	    
	    for(i = 0; i < pl; i++){
	        if (typeof parent[parts[i]] == 'undefined') {  
	            parent[parts[i]] = {};  
	        }
	        parent = parent[parts[i]];
	    }
	};

	/**
	 * Includes Javascript or CSS files into the DOM
	 * 
	 * @method include
	 * @param  {Mixed} filenames String or Array with the filenames
	 * @return void
	 */
	this.include = function(filenames){
		try{
			var filelist = [],
				x;
	
			if (typeof filenames == 'string') {
				filelist.push(filenames);
			} else if(typeof filenames == 'object'){
				filelist = filenames
			}
	
			for (x = 0; x < filelist.length; x++ ){
				var ext = filelist[x].split('.'),
					filetype = ext[ext.length - 1];
				
				if (filetype ==	'js'){ 
					//if filename is a JavaScript file
					var fileref = document.createElement('script');
						fileref.setAttribute('type','text/javascript');
						fileref.setAttribute('src', filelist[x]);
	
				} else if (filetype == 'css'){ 
					//if filename is a CSS file
					var fileref = document.createElement('link');
						fileref.setAttribute('rel', 'stylesheet');
						fileref.setAttribute('type', 'text/css');
						fileref.setAttribute('href', filelist[x]);
				}
	
				if (fileref !== void 0){
					document.getElementsByTagName('head')[0].appendChild(fileref);
				}
			}
			return true;
		} catch(e) {
			return false;
		}
	}

	// Call the constructor
	return this.__construct.apply(this, arguments);
};

Box2 = new Box2();
