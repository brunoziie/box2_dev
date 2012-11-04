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
