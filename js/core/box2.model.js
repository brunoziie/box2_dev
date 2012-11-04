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
