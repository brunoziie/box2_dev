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
/**
 * Sqlite local storage
 *
 * @static
 * @class Box2.Datasource.SQLite
 */
Box2.Datasource.SQLite = function(){

	var that = {};

	/**
	 * Database instance
	 * @private
	 * @attribute
	 * @type {Object}
	 */
	that.link = null;

	/**
	 * Get instance from SQLite database 
	 *
	 * @method getInstance
	 * @return {Object} Instance object
	 */
	this.getInstance = function(){
		if(that.link == null){
			var configs = Box2.Configs.read('database') || { name: 'db', version: 1, description: '', size : 2000000 };
			that.link = openDatabase(configs.name, configs.version, configs.description, configs.size);
		}
		return that;
	};

	/**
	 * Converts conditions to sql format
	 *
	 * @method parseConditions
	 * @param  {Object} conditions Conditions list
	 * @return {Strinh}            Conditions list in sql format
	 */
	that.parseConditions = function(conditions){
		var conditionsList = [],
			conditionsString = '',
			fieldName, field,
			operator, 
			regex,
			testOperator;

		if(typeof conditions == 'object') {
			if(Box2.objlen(conditions) > 0) {
				for(field in conditions){
					if(conditions.hasOwnProperty(field)){
						fieldName = field;
						operator = '=';
						regex = /([\w_]+)\s(=|<>|!=|<=|<|>=|>|<=>|LIKE|REGEXP)/;
						testOperator = fieldName.match(regex);

						if(testOperator != null) {
							fieldName = testOperator[1];
							operator = testOperator[2];
						}

						conditionsList.push(fieldName + ' ' + operator + ' "' + Box2.addSlashes(conditions[field].toString()) + '"');
					}
				}
			}

			if(conditionsList.length > 0){
				conditionsString = ' WHERE ' + conditionsList.join(' AND ');
			}
		}
		
		return conditionsString;
	};

	/**
	 * Converts fields list to sql format
	 *
	 * @method parseFields
	 * @param  {Object} fields Fields list
	 * @return {String}        Fields list in sql format
	 */
	that.parseFields = function(fields){
		var fieldsString = '*',
			fieldsList = [];

		if(typeof fields == 'object'){
			if(fields.length > 0) {
				for(var x = 0; x < fields.length; x++){
					fieldsList.push(fields[x]);
				}
				fieldsString = fieldsList.join(', ');			
			}
		}
		return fieldsString;
	};


	/**
	 * Run a query
	 *
	 * @method query
	 * @param  {String}   query    Query for run
	 * @param  {Function} callback Sucess callback
	 * @param  {Function} error    Error callback
	 * @return void
	 */	
	that.query = function(query, success, error) {
		var success = success || function(){},
			error = error || function(){},
			queryFunction = function(link) {
				return link.executeSql(query, [], function(){}, function(){});
			};

		that.link.transaction(queryFunction, error, success);
	};

	/**
	 * Run many queries
	 *
	 * @method multiQuery
	 * @param  {Function} functionsLote Function with the queries
	 * @param  {Function} callback      Sucess callback
	 * @param  {Function} error         Error callback
	 * @return void
	 */
	that.multiQuery = function(functionsLote, success, error) {
		var success = success || function(){},
			error = error || function(){};

		that.link.transaction(functionsLote, success, error);
	};

	/**
	 * Parse params and run a query
	 *
	 * @method fetch
	 * @param {Object}   model    Model from table
	 * @param {Object}   params   Params for the query
	 * @param {Function} callback Sucess callback
	 * @param {Function} error    Error callback
	 * @return void
	 **/
	that.fetch = function(model, params, callback, error){
		var fields = Box2.getObject(model.fields),
			conditions = Box2.getObject(model.conditions),
			limit = model.limit,
			order = model.order,
			limitString = '',
			orderString = '',
			conditionsString,
			fieldsString,
			query;

		if(typeof params != 'undefined'){
			if(typeof params.conditions == 'object'){
				conditions = Box2.merge(conditions, params.conditions);			
			}
			if(typeof params.fields == 'object'){
				fields = Box2.merge(fields, params.fields);					
			}
			if(typeof params.order != 'undefined'){
				order = ' ORDER BY ' + params.order;				
			}
			if(typeof params.limit != 'undefined'){
				limit = params.limit;
			}
		}

		conditionsString = that.parseConditions(conditions);
		fieldsString = that.parseFields(fields);

 		if(limit != false){
 			limitString = ' LIMIT ' + limit;
 		}
 		if(order != false){
 			orderString = ' ORDER BY ' + order;
 		}

		if(model.table != ''){
			query = 'SELECT ' + fieldsString + ' FROM ' + model.table + conditionsString + orderString + limitString;	
			that.query(query, callback, error);
		}else{
			error({message: 'Table name is not defined'});
		}
	};

	/**
	 * Convert query results in a associative array
	 *
	 * @method fetchArray
	 * @param  {Object} queryResult Query result
	 * @return {Array}              Associative array
	 */
	that.fetchArray = function(queryResult) {
		var rows = queryResult.rows,
			length = rows.length,
			x = 0,
			results = [];

		while (x < length) {
			results.push(rows.item(x));
			x++;
		}

		return results;
	};

	/**
	 * Insert a new entry into database
	 *
	 * @method insert
	 * @param {Object}   model    Model from table
	 * @param {Object}   data     Object at format key:value, with the fields and values to save into table
	 * @param {Function} callback Sucess callback
	 * @param {Function} error    Error callback
	 * @return void
	 **/
	that.insert = function(model, data, callback, error){
		var fields = [],
			values = [],
			field, 
			fieldsString, 
			valuesString,
			query;

		if(typeof data == 'object'){
			for(field in data){
				if(data.hasOwnProperty(field)){
					fields.push(field);
					values.push('"'+data[field]+'"');
				}
			}
		}

		fieldsString = fields.join(', ');
		valuesString = values.join(', ');

		if(model.table != '' && model.table != false) {
			if(fields.length > 0) {
				query = 'INSERT INTO ' + model.table + ' ('+fieldsString+') VALUES('+valuesString+')';
				that.query(query, callback, error);
			} else {
				error({ message: 'Mo data to insert' });
			}
		} else {
			error({ message: 'Table name is not defined' });
		}
	};

	/**
	 * Update one or many entry into database
	 *
	 * @method update
	 * @param {Object}   model      Model from table
	 * @param {Object}   data       Object at format key:value, with the fields and values to update into table
	 * @param {Object}   conditions Conditions to update
	 * @param {Function} callback   Sucess callback
	 * @param {Function} error      Error callback
	 * @return void
	 **/
	that.update = function(model, data, conditions, callback, error){
		var primaryKeyData = {},
			conditionsString,
			fields = [],
			field,
			query;

		for(field in data){
			if(data.hasOwnProperty(field)){
				if(field == model.primaryKey){
					primaryKeyData[field] = data[field];
				}
				fields.push(field + ' = "' + data[field] + '"');
			}
		}

		conditions = (typeof conditions == 'object') ? Box2.merge(Box2.getObject(model.conditions), conditions) : primaryKeyData ;
		conditionsString = that.parseConditions(conditions);

		if(model.table != '' && model.table != false) {
			if(fields.length > 0) {
				query = 'UPDATE ' + model.table + ' SET ' + fields.join(', ') + conditionsString;
				that.query(query, callback, error);
			} else {
				error({ message: 'No data to update' });
			}
		} else {
			error({ message: 'Table name is not defined' });
		}
	};

	/**
	 * Delete entries from database
	 *
	 * @method remove
	 * @param  {Object}   model      Model from table
	 * @param  {Object}   params     Params for the query
	 * @param  {Function} callback   Sucess callback
	 * @param  {Function} error      Error callback
	 * @return void
	 */
	that.remove = function(model, params, callback, error){
		var conditions = Box2.getObject(model.conditions),
			limit = '',
			order = '',
			conditionsString,
			query;

		if(typeof params != 'undefined'){
			if(typeof params.conditions !== 'undefined'){
				if(typeof params.conditions == 'object'){
					conditions = Box2.merge(conditions, params.conditions);				
				}
			}
		}

		conditionsString = that.parseConditions(conditions);

		if(model.table != ''){
			query = 'DELETE FROM ' + model.table + conditionsString;	
			that.query(query, callback, error);
		}else{
			error({message: 'Table name is not defined'});
		}
	};

	// Call constructor
	return this.getInstance.apply(this, arguments);
};
// Clousure for Handlebars library
Box2.Handlebars = function(){};	
Box2.Handlebars.prototype = Handlebars;
Box2.Handlebars = new Box2.Handlebars();
/**
 * HTML Entities utils
 *
 * @static
 * @class Box2.HTMLEntities
 */
Box2.HTMLEntities = function(){
	
	/**
	 * Encode a string for HTML Entities
	 * 
	 * @method encode
	 * @param  {String} string  String for encode
	 * @return {String}         Encoded string
 	 */
	this.encode = function(string){
		return string.replace(/ª/g,'&ordf;').
				replace(/º/g,'&ordm;').
				replace(/À/g,'&Agrave;').
				replace(/Á/g,'&Aacute;').
				replace(/Â/g,'&Acirc;').
				replace(/Ã/g,'&Atilde;').
				replace(/Ç/g,'&Ccedil;').
				replace(/È/g,'&Egrave;').
				replace(/É/g,'&Eacute;').
				replace(/Ê/g,'&Ecirc;').
				replace(/Ì/g,'&Igrave;').
				replace(/Í/g,'&Iacute;').
				replace(/Î/g,'&Icirc;').
				replace(/Ò/g,'&Ograve;').
				replace(/Ó/g,'&Oacute;').
				replace(/Ô/g,'&Ocirc;').
				replace(/Õ/g,'&Otilde;').
				replace(/Ù/g,'&Ugrave;').
				replace(/Ú/g,'&Uacute;').
				replace(/Û/g,'&Ucirc;').
				replace(/Ü/g,'&Uuml;').
				replace(/à/g,'&agrave;').
				replace(/á/g,'&aacute;').
				replace(/â/g,'&acirc;').
				replace(/ã/g,'&atilde;').
				replace(/ç/g,'&ccedil;').
				replace(/è/g,'&egrave;').
				replace(/ê/g,'&ecirc;').
				replace(/ì/g,'&igrave;').
				replace(/í/g,'&iacute;').
				replace(/î/g,'&icirc;').
				replace(/ò/g,'&ograve;').
				replace(/ó/g,'&oacute;').
				replace(/ô/g,'&ocirc;').
				replace(/õ/g,'&otilde;').
				replace(/ù/g,'&ugrave;').
				replace(/ú/g,'&uacute;').
				replace(/û/g,'&ucirc;').
				replace(/ü/g,'&uuml;'); 
	};

	/**
	 * Decode a string with HTML entities
	 * 
	 * @method decode
	 * @param  {String} string String for decode
	 * @return {String}        Decoded string
	 */
	this.decode = function(string){
		return string.replace(/&ordf;/g,'ª').
			replace(/&ordm;/g,'º').
			replace(/&Agrave;/g,'À').
			replace(/&Aacute;/g,'Á').
			replace(/&Acirc;/g,'Â').
			replace(/&Atilde;/g,'Ã').
			replace(/&Ccedil;/g,'Ç').
			replace(/&Egrave;/g,'È').
			replace(/&Eacute;/g,'É').
			replace(/&Ecirc;/g,'Ê').
			replace(/&Igrave;/g,'Ì').
			replace(/&Iacute;/g,'Í').
			replace(/&Icirc;/g,'Î').
			replace(/&Ograve;/g,'Ò').
			replace(/&Oacute;/g,'Ó').
			replace(/&Ocirc;/g,'Ô').
			replace(/&Otilde;/g,'Õ').
			replace(/&Ugrave;/g,'Ù').
			replace(/&Uacute;/g,'Ú').
			replace(/&Ucirc;/g,'Û').
			replace(/&Uuml;/g,'Ü').
			replace(/&agrave;/g,'à').
			replace(/&aacute;/g,'á').
			replace(/&acirc;/g,'â').
			replace(/&atilde;/g,'ã').
			replace(/&ccedil;/g,'ç').
			replace(/&egrave;/g,'è').
			replace(/&ecirc;/g,'ê').
			replace(/&igrave;/g,'ì').
			replace(/&iacute;/g,'í').
			replace(/&icirc;/g,'î').
			replace(/&ograve;/g,'ò').
			replace(/&oacute;/g,'ó').
			replace(/&ocirc;/g,'ô').
			replace(/&otilde;/g,'õ').
			replace(/&ugrave;/g,'ù').
			replace(/&uacute;/g,'ú').
			replace(/&ucirc;/g,'û').
			replace(/&uuml;/g,'ü');
	};
};

Box2.HTMLEntities = new Box2.HTMLEntities();
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
/**
 * Forms utils
 * 
 * @class Box2.Forms
 * @static
 */
Box2.Forms = function(){

	var that = {};
	/**
	 * Storage posted data
	 * 
	 * @private
	 * @attribute postData
	 */
	that.postData = [];

	/**
	 * Get saved post data
	 * 
	 * @method getPostData
	 * @return {Object} Post data
	 */
	this.getPostData = function(){
		return that.postData;
	}

	/**
	 * Set post data
	 * 
	 * @method setPostData
	 * @param  {Object} data Data to set
	 * @return void
	 */
	this.setPostData = function(data){
		that.postData = data;
	}

	/**
	 * Clean saved post data 
	 * 
	 * @method resetPostData
	 * @return void
	 */
	this.resetPostData = function(){
		that.postData = [];
	}

	// Contructor
	this.__construct = function(){
		document.addEventListener('DOMNodeInserted', this.__bind, true);
		return this;
	};

	/**
	 * Apply event to new form inserted into DOM
	 * 
	 * @method __bind
	 * @private
	 * @return void
	 **/
	this.__bind = function(){
		if(typeof arguments[0].target != 'undefined'){
			element = arguments[0].target;
			
			if (element.nodeName == 'FORM'){
				element.setAttribute('method', 'post');
				element.onsubmit = this.send(element);
			}
		}
	};

	/**
	 * Serialize form data
	 * 
	 * @method serialize
	 * @param  {DOMElement} form Form for serialize inputs data
	 * @return {Object}          Serialized form data
	 **/
	this.serialize = function (form) {
		// Original from: http://code.google.com/p/form-serialize/
		// Modified by: bruno ziiê
		
		if (!form || form.nodeName !== "FORM") {
			return;
		}

		var i, j, q = {};
		for (i = form.elements.length - 1; i >= 0; i = i - 1) {
			if (form.elements[i].name === "") {
				continue;
			}
			switch (form.elements[i].nodeName) {
			case 'INPUT':
				switch (form.elements[i].type) {
				case 'text':
				case 'hidden':
				case 'password':
				case 'button':
				case 'reset':
				case 'submit':
					q[form.elements[i].name] = form.elements[i].value;
					break;
				case 'checkbox':
				case 'radio':
					if (form.elements[i].checked) {
						q[form.elements[i].name] = form.elements[i].value;
					}						
					break;
				case 'file':
					break;
				}
				break;
			case 'TEXTAREA':
				q[form.elements[i].name] = form.elements[i].value;
				break;
			case 'SELECT':
				switch (form.elements[i].type) {
				case 'select-one':
					q[form.elements[i].name] = form.elements[i].value;
					break;
				case 'select-multiple':
					for (j = form.elements[i].options.length - 1; j >= 0; j = j - 1) {
						if (form.elements[i].options[j].selected) {
							q[form.elements[i].name] = form.elements[i].options[j].value;
						}
					}
					break;
				}
				break;
			case 'BUTTON':
				switch (form.elements[i].type) {
				case 'reset':
				case 'submit':
				case 'button':
					q[form.elements[i].name] = form.elements[i].value;
					break;
				}
				break;
			}
		}

		return q;
	};

	/**
	 * Parse a form submit and if the target is a internal page of the applications
	 * serialize form data and call the controller
	 * 
	 * @method send
	 * @param  {DOMElement} form Form that called submit event
	 * @return {Boolean}         True if sucess
	 **/
	this.send = function(form){
		var formAction = form.action.split('#');

		if(formAction.length > 1){
			var formData = this.serialize(form);
			var path = '#'+formAction[1];
			var hash = window.location.hash;

			if(hash != path){
				this.postData.push(formData);
				window.location.hash = path;
			} else {
				var data = Mapper.parse(hash);
				Loader.controller(data, formData);
			}

			return false;
		} else {
			return true;
		}
	};

	// Call the constructor
	return this.__construct.apply(this, arguments);

};

Box2.Forms = new Box2.Forms();
/**
 * Text formater utils
 * 
 * @static
 * @class Box2.Inflector
 */
Box2.Inflector = function(){
	
	var that = {};
	/**
	 * Translation table
	 * 
	 * @attribute
	 * @private
	 * @type Array
	 **/
	that.translationTable = [
		['ä|æ|ǽ','ae'], ['ö|œ','oe'], ['ü','ue'], ['Ä','Ae'], ['Ü','Ue'], ['Ö','Oe'], 
		['À|Á|Â|Ã|Ä|Å|Ǻ|Ā|Ă|Ą|Ǎ','A'], ['à|á|â|ã|å|ǻ|ā|ă|ą|ǎ|ª','a'], ['Ç|Ć|Ĉ|Ċ|Č','C'], 
		['ç|ć|ĉ|ċ|č','c'], ['Ð|Ď|Đ','D'], ['ð|ď|đ','d'], ['È|É|Ê|Ë|Ē|Ĕ|Ė|Ę|Ě','E'], 
		['è|é|ê|ë|ē|ĕ|ė|ę|ě','e'], ['Ĝ|Ğ|Ġ|Ģ','G'], ['ĝ|ğ|ġ|ģ','g'], ['Ĥ|Ħ','H'], 
		['ĥ|ħ','h'], ['Ì|Í|Î|Ï|Ĩ|Ī|Ĭ|Ǐ|Į|İ','I'], ['ì|í|î|ï|ĩ|ī|ĭ|ǐ|į|ı','i'], ['Ĵ','J'], 
		['ĵ','j'], ['Ķ','K'], ['ķ','k'], ['Ĺ|Ļ|Ľ|Ŀ|Ł','L'], ['ĺ|ļ|ľ|ŀ|ł','l'], ['Ñ|Ń|Ņ|Ň','N'], 
		['ñ|ń|ņ|ň|ŉ','n'], ['Ò|Ó|Ô|Õ|Ō|Ŏ|Ǒ|Ő|Ơ|Ø|Ǿ','O'], ['ò|ó|ô|õ|ō|ŏ|ǒ|ő|ơ|ø|ǿ|º','o'], 
		['Ŕ|Ŗ|Ř','R'], ['ŕ|ŗ|ř','r'], ['Ś|Ŝ|Ş|Š','S'], ['ś|ŝ|ş|š|ſ','s'], ['Ţ|Ť|Ŧ','T'], ['ţ|ť|ŧ','t'], 
		['Ù|Ú|Û|Ũ|Ū|Ŭ|Ů|Ű|Ų|Ư|Ǔ|Ǖ|Ǘ|Ǚ|Ǜ','U'], ['ù|ú|û|ũ|ū|ŭ|ů|ű|ų|ư|ǔ|ǖ|ǘ|ǚ|ǜ','u'], ['Ý|Ÿ|Ŷ','Y'], 
		['ý|ÿ|ŷ','y'], ['Ŵ','W'], ['ŵ','w'], ['Ź|Ż|Ž','Z'], ['ź|ż|ž','z'], ['Æ|Ǽ','AE'], ['ß','ss'], 
		['Ĳ','IJ'], ['ĳ','ij'], ['Œ','OE'], ['ƒ','f']
	];

	// Constructor
	this.__construct = function(){
		return this;
	};

	/**
	 * First character to uppercase
	 *
	 * @method capitalize
	 * @param  {String} string String for change
	 * @return {String}
	 **/
	this.capitalize = function(string){
		var firstChar = string.substr(0, 1).toUpperCase();
		return string.replace( /(^|\s)([a-z])/ , firstChar);
	};

	/**
	 * Remove special chars and replace spaces by underscore
	 * 
	 * @method slug
	 * @param  {String} string       String for change
	 * @param  {String} replacement  Character for replace spaces
	 * @return {String}
	 **/
	this.slug = function(string, replacement){		
		var replacement = replacement || '_',
			len = that.translationTable.length,
			i;

		for (i = len - 1; i >= 0; i--){
			regex = new RegExp(that.translationTable[i][0]);
			string = string.replace(regex, that.translationTable[i][1]);
		}

		return string.replace(/\ +/, ' ').replace(/[^a-zA-Z0-9\ ]/, '').replace(' ', replacement).toLowerCase();
	};

	/**
	 * Converts CamelCase to string separated by underscore
	 *
	 * @method humanize
	 * @param  {String} string      String for change
	 * @return {String}             Modified string
	 */
	this.humanize = function(string){
		return string.replace(/(.)([A-Z])/g, "$1_$2").toLowerCase();
	};

	// Call the constructor
	return this.__construct.apply(this, arguments);
};

Box2.Inflector = new Box2.Inflector();
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
/**
 * Load application's script files
 *
 * @static
 * @class Box2.Loader
 */
Box2.Loader = function(){
	
	var that = {};

	/**
	 * HTTP request object
	 *
	 * @private
	 * @attribute http
	 * @type Object
	 */
	that.http = null;

	// Constructor
	this.__construct = function(){
		that.http = new Box2.Ajax();
		return this;
	};

	/** 
	 * Load/start a controller
	 *
	 * @method controller
	 * @param {Object} data     Controller's informations
	 * @param {Object} formData Form post data
	 * @return void
	 **/
	this.controller = function(data, formData){
		var controllerName = Box2.Inflector.capitalize(data.controller) + 'Controller',
			controllerScript,
			controller,
			script,
			len, i;

		if(typeof Box2.Controllers[controllerName] == 'undefined'){
			controllerScript = that.__loadScript(Box2.Inflector.slug(data.controller), 'controller');

			if(typeof controllerScript == 'string'){
				script = document.createElement('script');
				script.setAttribute('type','text/javascript');
				script.innerHTML = controllerScript;
				document.body.appendChild(script);
			}
		}

		if(typeof data.action != 'undefined') {
			controller = Box2.Controllers[controllerName];
			controller.data = formData || {};
			len = controller.uses.length;

			// Load that this controllers depends if not till loaded
			for(i = 0; i < len; i++) {
				this.model(controller.uses[i]);
			}

			controller.__construct();
			controller.params = data;
			controller.output = '';
			controller[data.action].apply(controller, data.args);
		}

	};

	/** 
	 * Load a model file
	 *
	 * @method model
	 * @param {String} name Model name
	 * @return void
	 */
	this.model = function(name){
		var modelName = Box2.Inflector.capitalize(name),
			modelScript,
			script; 

		if(typeof Box2.Models[modelName] == 'undefined'){
			modelScript = that.__loadScript(Box2.Inflector.humanize(modelName), 'model');

			if(typeof modelScript == 'string'){
				script = document.createElement('script');
				script.setAttribute('type','text/javascript');
				script.innerHTML = modelScript;
				document.body.appendChild(script);
			}
		}
	};

	/** 
	 * Load a view file
	 *
	 * @method view
	 * @param  {String} name View path
	 * @return {String}      View html content
	 */
	this.view = function(path){
		var viewScript; 

		if(typeof Box2.Views[path] == 'undefined'){
			viewScript = that.__loadScript(path, 'view');
			Box2.Views[path] = Box2.Handlebars.compile(viewScript);
		}

		return Box2.Views[path];
	};

	/** 
	 * Load a layout file
	 *
	 * @method layout
	 * @param  {String} name          Layout path
	 * @param  {String} outputContent Rendered output view content
	 * @return {String}               Layout html content
	 */
	this.layout = function(path, outputContent){
		var layout; 

		if(typeof Box2.Layouts[path] == 'undefined'){
			layout = that.__loadScript(path, 'layout');
			Box2.Layouts[path] = Box2.Handlebars.compile(layout.replace('{{content}}', outputContent));
		}

		return Box2.Layouts[path];
	};

	/** 
	 * Load files by yours type
	 *
	 * @private
	 * @method loadScript
	 * @param  {String} name File name
	 * @param  {String} type File script type (model, view, controller, helper, layout)
	 * @return {Mixed}       String found the file, False if not
	 */
	that.__loadScript = function(name, type){
		switch(type){
			case 'model':
				filepath = 'js/app/models/' + name + '.js';
			break;
			case 'view':
				filepath = 'js/app/views/' + name + '.view.html';
			break;
			case 'controller':
				filepath = 'js/app/controllers/' + name + '_controller.js';
			break;
			case 'helper':
				filepath = 'js/app/helpers/' + name + '_helper.js';
			break;
			case 'layout':
				filepath = 'js/app/layouts/' + name + '.layout.html';
			break;
			default:
				filepath = '';
		};

		if(filepath != ''){
			return that.http.request(filepath);
		} else {
			return false;
		}
	};

	// Call the constructor
	return this.__construct.apply(this, arguments);
};

Box2.Loader = new Box2.Loader();
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
/**
 * Model
 * 
 * @class Box2.Model
 * @constructor
 */
Box2.Model = function(){

	/**
	 * Database connection instance
	 * @attribute dbInstance
	 * @type Object
	 */
	this.dbInstance = false;

	/**
	 * Model's table
	 * @attribute table
	 * @type String
	 **/ 
	this.table = false;

	/** 
	 * Default order
	 * @attribute order
	 * @type String
	 **/
	this.order = false;

	/**
	 * Primary key name
	 * @attribute primaryKey
	 * @type String
	 **/
	this.primaryKey = 'id';

	/**
	 * Fields for return in the query
	 * @attribute fields
	 * @type Array
	 **/
	this.fields = [];

	/** 
	 * Default results limit
	 * @attribute limit
	 * @type Number
	 **/
	this.limit = false;

	/**
	 * Default query's conditions
	 * @attribute conditions
	 * @type Object
	 **/
	this.conditions = {};

	// Constructor
	this.__construct = function(){
		this.dbInstance = Box2.Datasource.SQLite();
		return this;	
	};

	/** 
	 * Run a query
	 *
	 * @method query
	 * @param {String}   query    Query to be runed
	 * @param {Function} callback Sucess callback
	 * @param {Function} error    Error callback
	 * @return void
	 **/
	this.query = function(query, callback, error){
		var dbInstance = this.dbInstance,
			callback = callback || function(){},
			error = error || function(){};
		
		dbInstance.query(query, function(transaction, response){
			if(typeof response != 'undefined') {
				if(response.rows.length > 0){
					callback(dbInstance.fetch(response)); 
				} else {
					callback([]);
				}
			}
		}, function(transaction, errors){
			error(errors);
		});

	};

	/**
	 * Parse params and run a query
	 *
	 * @method fetch
	 * @param {Object}   params   Params for the query
	 * @param {Function} callback Sucess callback
	 * @param {Function} error    Error callback
	 * @return void
	 **/
	this.fetch = function(params, callback, error){
		var dbInstance = this.dbInstance,
			callback = callback || function(){};

		that.dbInstance.fetch(this, params, callback, error);
	};

	/**
	 * Get all register from a table
	 * 
	 * @method all
	 * @param {Object}   params   Params for the query
	 * @param {Function} callback Sucess callback
	 * @param {Function} error    Error callback
	 * @return void
	 **/
	this.all = function(params, callback, error){
		this.fetch(params, callback, error);
	};

	/**
	 * Get first register from a query
	 *
	 * @method first
	 * @param {Object}   params   Params for the query
	 * @param {Function} callback Sucess callback
	 * @param {Function} error    Error callback
	 * @return void
	 **/
	this.first = function(params, callback, error){		
		params = params || {};
		params.limit = 1;
		this.fetch(params, callback, error);
	};

	/**
	 * Find a row by primary key
	 *
	 * @method firstById
	 * @param {Integer}  id       Primary key id
	 * @param {Function} callback Sucess callback
	 * @param {Function} error    Error callback
	 * @return void
	 **/
	this.firstById = function(id, callback, error){
		var params = {};
			params.conditions = {};
			params.conditions[this.primaryKey] = id;
			params.limit = 1;

		this.fetch(params, callback, error);
	};

	/**
	 * Save data into the table. 
 	 * OBS: If found a field with same name that the primary key this data will 
 	 * to be updated. If you wanna to create a new entry maybe you should to use the method insert.
	 *
	 * @method save
	 * @param {Object}   data     Object at format key:value, with the fields and values to save into table
	 * @param {Function} callback Sucess callback
	 * @param {Function} error    Error callback
	 *
	 **/
	this.save = function(data, callback, error){
		var method = 'insert',
			callback = callback || function(){},
			error = error || function(){},
			field;

		if(typeof data == 'object'){
			for(field in data){
				if(data.hasOwnProperty(field)){
					if(field == this.primaryKey){
						method = 'update';
					}
				}
			}
			this[method](data, callback, error);
		}else{
			error({ message: 'Data is not a object' });
		}
	};

	/**
	 * Insert a new entry into database
	 *
	 * @method insert
	 * @param {Object}   data     Object at format key:value, with the fields and values to save into table
	 * @param {Function} callback Sucess callback
	 * @param {Function} error    Error callback
	 * @return void
	 **/
	this.insert = function(data, callback, error){
		var callback = callback || function(){},
			error = error || function(){};

		that.dbInstance.insert(this, data, callback, error);
	};

	/**
	 * Update method abstration
	 *
	 * @method update
	 * @param {Object}   data       Object at format key:value, with the fields and values to update into table
	 * @param {Object}   conditions Conditions to update
	 * @param {Function} callback   Sucess callback
	 * @param {Function} error      {Function} Error callback
	 * @return void
	 **/
	this.update = function(data, conditions, callback, error){
		var callback = callback || function(){},
			error = error || function(){};

		that.dbInstance.update(this, data, conditions, callback, error);
	};

	/**
	 * Delete a entry by primary key
	 *
	 * @method deleteById
	 * @param {Number}   id       Primary key value
	 * @param {Function} callback Sucess callback
	 * @param {Function} error    Error callback
	 * @return void
	 **/
	this.deleteById = function(id, callback, error){
		var callback = callback || function(){},
			error = error || function(){},
			params = {};
			
			params.conditions = {};
			params.conditions[this.primaryKey] = id;

		if(!isNaN(parseInt(id))){
			this.deleteAll(params, callback, error);
		} else {
			error({ message : 'Id param is not a interger number'});
		}
	};

	/**
	 * Delete all entry by a condition
	 *
	 * @method deleteAll
	 * @param {Object}   params   Params for the query
	 * @param {Function} callback Sucess callback
	 * @param {Function} error    Error callback
	 * @return void
	 **/
	this.deleteAll = function(params, callback, error){
		var callback = callback || function(){},
			error = error || function(){};

		that.dbInstance.remove(this, params, callback, error);
	};
	
	// Call the constructor
	return this.__construct.apply(this, arguments);
}
/**
 * View
 *
 * @class Box2.View
 * @constructor
 */
Box2.View = function(){

	/**
	 * Layout used by this view
	 *
	 * @attribute
	 * @type {String}
	 */
	this.layout = 'default';

	/**
	 * Render a view
	 *
	 * @method render
	 * @param  {String} path View path
	 * @param  {Object} vars Object with variables for the view
	 * @return {String}      Rendered view's content
	 */
	this.render = function(path, vars){
		template = Box2.Loader.view(path);
		return template(vars);
	};	

	/**
	 * Render a layout
	 *
	 * @method renderLayout
	 * @param  {String} viewsContent Rendered content from the views
	 * @param  {Object} data         Object with variables for the layout
	 * @return {String}              Rendered layout
	 */
	this.renderLayout = function(viewsContent, data){
		var vars = data || {}, 
			template;

		viewsContent = viewsContent || '';
		template = Box2.Loader.layout(this.layout, viewsContent);

		return template(vars);
	}
};
/**
 * Controller
 *
 * @class Box2.Controller
 * @constructor
 */
Box2.Controller = function(){
	var that = {};

	/**
	 * Models that will to be used by controller.
	 * @attribute uses
	 * @type Array
	 **/
	this.uses = [];

	/**
	 * Default layout
	 * @attribute layout
	 * @type String
	 **/
	this.layout = 'default';

	/**
	 * Helpers that will to be used by controller
	 * @attribute helpers
	 * @type Object
	 **/
	this.helpers = [];

	/**
	 * Data received via form post
	 * @attribute data
	 * @type Object
	 **/
	this.data = {};

	/**
	 * Controller params
	 * @attribute params
	 * @type Object
	 **/
	this.params = {};

	/**
	 * Output generated by view's render
	 * @attribute output
	 * @type {String}
	 */
	this.output = '';

	/**
	 * Variables for the views
	 * @private
	 * @attribute vars
	 * @type {Object}
	 */
	that.vars = {};

	// Constructor
	this.__construct = function(){
		this.Models = Box2.Models;
		this.Components = Box2.Components;
		this.View = new Box2.View();
		this.Helpers = Box2.Helpers;
		return this;
	};

	/**
	 * Set a variable for the view
	 *
	 * @method set
	 * @param {String} key   Variable name
	 * @param {Mixed}  value Value to variable
	 */
	this.set = function(key, value){
		that.vars[key] = value;
	};

	/**
	 * Get a variable from Controller.vars
	 *
	 * @method get
	 * @param  {String} key Object key
	 * @return void
	 */
	this.get = function(key){
		return that.vars[key] || null;
	}

	/**
	 * Clear the views vars
	 *
	 * @method clear
	 * @return void
	 */
	this.clear = function(){
		that.vars = {};
	};

	/**
	 * Redirect to page into application
	 *
	 * @method redirect
	 * @param {String} url Destination to redirect
	 **/
	this.redirect = function(url){
		Box2.History.removeLast();
		window.location.hash = '#' + url;
	};

	/**
	 * Render a view and put to output attribute
	 *
	 * @method render
	 * @param  {String} path View parh
	 * @return void
	 */
	this.render = function(path){
		var view = new Box2.View(), 
			htmlContent;

		view.layout = this.layout;
		that.output += view.render(path, that.vars);
	};

	/**
	 * Show the rendered views
	 *
	 * @method renderView
	 * @return void
	 */
	this.renderView = function(){
		var view = this.View,
			params = this.params,
			output;

		if(this.output == ''){
			output = view.render(params.controller+'/'+params.action, that.vars);
		}else{
			output = this.output;
		}

		view.layout = this.layout;
		document.getElementById('stage').innerHTML = view.renderLayout(output, that.vars);
	};

	// Call the constructor
	return this.__construct.apply(this, arguments);
};
