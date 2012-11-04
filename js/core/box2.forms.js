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
