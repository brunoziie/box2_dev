/**
 * Default Application's controller
 * 
 * @class Box2.Controllers.AppController
 **/
Box2.Controllers.AppController = Box2.extend(Box2.Controller, function(){

	/**
	 * Default models
	 * @type {Array}
	 */
	this.uses = ['AppModel'];

	/**
	 * Default helpers
	 * @type {Array}
	 */
	this.helpers = [];

	/**
	 * Default layout
	 * @type {String}
	 */
	this.layout = 'default';

});