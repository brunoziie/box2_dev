/**
 * Home Controller
 *
 * @class Box2.Controllers.HomeController
 */
Box2.Controllers.HomeController = Box2.extend(Box2.Controllers.AppController, function(){

	/**
	 * Index action
	 * 
	 * @return void
	 */
	this.index = function(){

		this.set('appName', 'Box2 Framework');
		this.set('appVersion', '0.2b');
		this.set('appDescription', "Let's work?");

		this.renderView();
	};

});