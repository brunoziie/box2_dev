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
