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
