Box2.Models.AppModel = Box2.extend(Box2.Model, function(){

	this.table = false;
	this.order = 'id DESC';
	this.primaryKey = 'id';
	this.fields = [];
	this.limit = false;
	this.conditions = {};

	/**
	 * Cria estrutura do banco de dados
	 **/
	this.__initDatabase = function(){
		this.query('CREATE TABLE IF NOT EXISTS "cities" ("id" integer primary key autoincrement, "name" varchar(140));');
		this.query('CREATE TABLE IF NOT EXISTS "districts" ("id" integer primary key autoincrement, "name" varchar(140), "cities_id" integer );');
		this.query('CREATE TABLE IF NOT EXISTS "itineraries" ("id" integer primary key autoincrement, "lines_id" integer, "name" varchar(140));');
		this.query('CREATE TABLE IF NOT EXISTS "lines" ("id" integer primary key autoincrement, "name" varchar(140) , "rate" varchar(10));');
		this.query('CREATE TABLE IF NOT EXISTS "streets" ("id" integer primary key autoincrement, "name" varchar(140) , "street_type" varchar(140) , "districts_id" integer, "cities_id" integer);');
		this.query('CREATE TABLE IF NOT EXISTS "streets_itineraries" ("id" integer primary key autoincrement, "streets_id" integer, "itineraries_id" integer, "order" integer, "sense" varchar(3));');
		this.query('CREATE TABLE IF NOT EXISTS "stops" ("code" varchar(6), "lat" varchar(20), "lon" varchar(20), "street" varchar(250), "city" varchar(50), "neighborhood" varchar(140), "number" varchar(10), "ref" varchar(250));');
		this.query('CREATE TABLE IF NOT EXISTS "stops_itineraries" ("code" varchar(6), "itineraries_id" integer)');
	};

});