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
