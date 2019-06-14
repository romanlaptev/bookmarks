/*
var webSqlDb = webSQLmodule();
console.log("webSQLmodule:", webSqlDb);
*/
var webSQLmodule =  function(){
	
//console.log("init webSQLmodule.....");
	
	// private variables and functions
	_vars = {
"logMsg" : "",
"dbName" : webApp.vars["cache"]["dbName"],//"localcache"
"version": "1.0",
"displayName": "Web SQL Database....",
"initSize" : 1*1024*1024,
"dbLink" : null
	}//end vars{}
//console.log( _vars );

	function _connectDB(){
		
		if( _vars["dbLink"] ){
			return _vars["dbLink"];
		}
		
		try {
			db = openDatabase( 
				_vars["dbName"], 
				_vars["version"], 
				_vars["displayName"], 
				_vars["initSize"],
				function( database ){
	console.log( "Connect to database " +_vars["dbName"]+"...", "success");
	console.log( database );		
				}
			);
	//console.log(db);
			_vars["dbLink"] = db;
			return db;
			
		} catch(e) {
	console.log(e);
	console.log("Failed to connect to database " + _vars["dbName"], "error");
	console.log("Error code: "+e.code+", " + e.message, "error");
	/*
			if (e == 2) {
				// Version number mismatch.
				alert("Invalid database version.");
			} else {
				alert("Unknown error "+e+".");
			}
	*/
		}//end try
	}//end _connectDB()

	function _runTransaction( sql, db, callBack ){
		if( typeof sql === "string"){
			
			//var timeStart = new Date();
			//_timer["total"] = _set_timer();		
			
			db.transaction( function(t){
				t.executeSql( sql, [], onSuccess, onError );
			}, errorCB, successCB );//end transaction
		} else {
	//console.log(sql);
			if( sql.length > 0){
				//var timeStart = new Date();
				db.transaction( function(t){
						for( n = 0; n < sql.length; n++ ){
							t.executeSql( sql[n], [], _onSuccess, _onError );
						}//next
					}, _errorCB, _successCB );//end transaction
			}
		}

		function errorCB(e) {
	_vars.logMsg = "- end transaction, error processing SQL";		
	console.log(_vars.logMsg, "error");
	console.log(_vars.logMsg, e);
		}

		function successCB() {
	_vars.logMsg = "- end transaction, success...";
	//console.log(_vars.logMsg, "success");
	console.log(_vars.logMsg, arguments);
		}
		
		function onSuccess(t, result) {
	//console.log("onSuccess()", result, result.rows.length);
	console.log("success execute SQL: <b>" + sql +"</b>", "success");
			
			//var timeEnd = new Date();
			//var runtime = (timeEnd.getTime() - timeStart.getTime()) / 1000;
	//console.log("onSuccess()", sql, timeStart, timeEnd, runtime );
			//var total = _get_timer( _timer["total"] );
	//console.log("onSuccess()", sql, total );
			
			if( typeof callBack === "function"){
				callBack( result, sql );
			}
			
		}//end onSuccess
		
		function onError(t, e) {
console.log("onError()", e.code, e.message, sql);
_vars.logMsg = "error execute SQL: "+sql+", code: "+e.code+", <b>" + e.message + "</b>";
console.log(_vars.logMsg, "error");
		}//end onError
		
	//----------------- callbacks for many executeSql
		function _errorCB(e) {
_vars.logMsg = "- end transaction, error processing SQL:";		
console.log(_vars.logMsg, e);
			if( typeof callBack === "function"){
				callBack();
			}
		}
		function _successCB() {
_vars.logMsg = "- end transaction, success...";
console.log(_vars.logMsg, arguments);
			if( typeof callBack === "function"){
				callBack();
			}
		}

		function _onSuccess(t, result) {
console.log("_onSuccess()", result, result.rows.length );
		}//end _onSuccess
		
		function _onError(t, e) {
	console.log("_onError()", e.code, e.message);
		}//end _onError
		
	}//end _runTransaction()



	function _createTable( opt ){
//console.log(arguments);
		var p = {
			"tableName": "",
			"fieldsInfo": ""
		};
		//extend p object
		for(var key in opt ){
			p[key] = opt[key];
		}
//console.log(p);	

		//var sql = "CREATE TABLE IF NOT EXISTS " + tableName+ " (food_name TEXT PRIMARY KEY, calories REAL, servings TEXT)";
		//var sql = "CREATE TABLE IF NOT EXISTS " + tableName+ "(id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL DEFAULT 'John Doe', shirt TEXT NOT NULL DEFAULT 'Purple')";
	//insertDay DATETIME	
	//price INTEGER,


		var sql = "CREATE TABLE IF NOT EXISTS {{table_name}} ( {{fields_info}} );";
		sql = sql.replace("{{table_name}}", p["tableName"]);

		if( p["fieldsInfo"] !== ""){
			var sfieldsInfo = "";
			var n = 0;
			for( var fieldName in p["fieldsInfo"] ){
				if(n > 0){
					sfieldsInfo += ", ";
				}
				sfieldsInfo += fieldName +" "+ p["fieldsInfo"][fieldName];
				n++;
			}//next
			sql = sql.replace("{{fields_info}}", sfieldsInfo);
		} else {
			sql = sql.replace(" {{fields_info}} ", "test TEXT");
		}
		
console.log( sql );

		var db = _connectDB();
		_runTransaction( sql, db, postFunc );

		function postFunc( result ){
console.log("table " + p["tableName"]+ " was created...", result);
		}

	}//end _createTable()


	function _dropTable( tableName ) {
		var sql = "DROP TABLE " + tableName;
		var db = _connectDB();
		_runTransaction( sql, db, postFunc );
		
		function postFunc( result ){
console.log( result, typeof result);
		}

	}//end _dropTable()

	function _clearTable( tableName ) {
		var sql = "DELETE FROM " + tableName;
		var db = _connectDB();
		_runTransaction( sql, db, postFunc );
		
		function postFunc( result ){
console.log("table " + name + " was cleared...", result);
		}
	}//end _clearTable()


	// public interfaces
	return{
		createTable: _createTable,
		dropTable: _dropTable,
		// deleteStore: _deleteStore,
		// getListStores: _getListStores,
		// numRecords: _numRecords,
		// getRecords: _getRecords,
		// getRecord: _getRecord,
		clearTable: _clearTable,
		// addRecords: _addRecords,
		// addRecord: _addRecord,
		// deleteRecord: _deleteRecord,
		dbInfo: _vars
	};

};//end module