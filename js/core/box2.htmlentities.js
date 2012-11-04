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
