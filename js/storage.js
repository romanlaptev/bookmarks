//================================ STORAGE methods
var storage = {
	// "init": function(){
		// return _init_cache();
	// },
	
	// "getXml": function(){
		// _get_xml_from_storage();
	// },

	// "putItem": function(key, value, callback){
		// if ( config["use_localcache"] ) {
			// return _put_to_storage( key, value, callback );
		// }
	// },
	
	// "getItem": function(key, callback){
		// if ( config["use_localcache"] ) {
			// return _getItemFromStorage( key, callback );
		// }
	// },
	
	"checkAppData": function(opt){
		return _checkAppData( opt );
	},
	// "saveAppData": function(opt){
		// if ( config["use_localcache"] ) {
			// return _saveAppData( opt );
		// }
	// }//,
	//"getAppData": function(opt){
		//return _getAppData( opt );
	//}
	
};//end storage
console.log("storage object:", storage);


function _checkAppData( opt ){
//console.log("function _checkAppData()", opt);
	var p = {
		//"dbName" : webApp.vars["cache"]["dbName"],
		//"dataStoreName" : webApp.vars["cache"]["dataStoreName"],
		"callback" : null
	};
	//extend p object
	for(var key in opt ){
		p[key] = opt[key];
	}
//console.log(p);

	var _lastModified = false;
	
	//check data store key  ( bookmarks.json )
	indexedDatabase.getListStores({
		"dbName" : webApp.vars["cache"]["dbName"],
		"callback": function( listStores ){
console.log("listStores: ", listStores);

			if( typeof listStores !== "undefined" &&
					listStores.length > 0){

					for( var n = 0; n < listStores.length; n++){
						if( listStores[n] === webApp.vars["cache"]["dataStoreName"] ){
							
indexedDatabase.getRecord({
	"dbName" : webApp.vars["cache"]["dbName"],
	"storeName" : webApp.vars["cache"]["dataStoreName"],
	"recordKey" : "lastModified",
	"callback" : function( data, runtime ){
console.log(data);

		if(!data){
			if(typeof p["callback"] === "function"){
				p["callback"]( _lastModified );
			}
		} else {
			_lastModified = data;//"00-00-0000"
			if(typeof p["callback"] === "function"){
				p["callback"]( _lastModified );
			}
		}
		
	}
});
							break;
						}
					}//next

			} else {
				
				if(typeof p["callback"] === "function"){
					p["callback"]( _lastModified );
				}
				
			}
			

		}
	});

}//end _checkAppData()
				

/*
function _getAppData( opt ){
//console.log("function _getAppData()", opt);
	var p = {
		"callback" : null
	};
	//extend p object
	for(var key in opt ){
		p[key] = opt[key];
	}
console.log(p);

	//.............
		
	if(typeof p["callback"] === "function"){
		p["callback"]();
	}
}//end _getAppData()
*/