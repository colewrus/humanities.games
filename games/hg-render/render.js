/*!
 * Deep merge two or more objects together.
 * (c) 2019 Chris Ferdinandi, MIT License, https://gomakethings.com
 * @param   {Object}   objects  The objects to merge together
 * @returns {Object}            Merged values of defaults and options
 */
const deepMerge = function () {
	// Setup merged object
	var newObj = {};
	// Merge the object into the newObj object
	var merge = function (obj) {
		for (var prop in obj) {
			if (obj.hasOwnProperty(prop)) {
				// If property is an object, merge properties
				if (Object.prototype.toString.call(obj[prop]) === '[object Object]') {
					newObj[prop] = deepMerge(newObj[prop], obj[prop]);
				} else {
					newObj[prop] = obj[prop];
				}
			}
		}
	};
	// Loop through each object and conduct a merge
	for (var i = 0; i < arguments.length; i++) {
		merge(arguments[i]);
	}
	return newObj;
};

/* Global structure */
var gameData = {
	text: {},
	images: {},
	sounds: {},
	options: {}
}

/* Async helper function */
function hgAjax(url, params, fn) {
	var method = (typeof params !== 'undefined' && typeof params.method !== 'undefined') ? params.method : 'GET';
	var data = (typeof params !== 'undefined' && typeof params.data !== 'undefined') ? params.data : {};
	var request = new XMLHttpRequest();
	request.open(method, url, true);
	request.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
	request.onload = function() {
	  if (this.status >= 200 && this.status < 400) {
	    var response = JSON.parse(this.response);
	    fn({ success: true, data: response });
	  } else {
		var resp = this.response;
		console.log('failure',resp);
		throw 'Load Error';
	  }
	};
	request.onerror = function(error) {
	  throw 'Load Error';
	};
	if(method == 'POST') {
		var sendData = JSON.stringify(data);
		request.send(sendData);
	} else {
		request.send();
	}
}

/* Fetches the defaults (static) and the custom (dynamic). URLs will change. */
function hgSetupValues(fn) {
	/* Fetch the json files */
	try {
		hgAjax(dataSource, { method: 'GET'}, function(custom){
			console.log('custom',custom);
			hgAjax(defaultSource, { method: 'GET'}, function(defaults){
				console.log('defaults',defaults);
				/* Merges the two objects */
				gameData = deepMerge(gameData,defaults.data,custom.data);
				console.log('merged',gameData);
				/* Let the ball roll. */
				fn();
			});
		});
	} catch(e) {
		console.log('Error',e);
	}
}

/* Helper that retrieves from the gameData obj */
function hgFetchValue( props, obj ) {
	/* Defaults to gameData for first level */
	var obj = (typeof obj !== 'undefined') ? obj : gameData;
	/* Nested property can retrive */
  	const prop = props.shift();
  	if (!obj[prop] || !props.length) {
    	return obj[prop]
  	}
  	return hgFetchValue(props, obj[prop])
}

function hgGet( key ) {
	var props = key.split('.');
	if( props.length > 0 ) {
		var prop = hgFetchValue( props );
		if( typeof prop.custom !== 'undefined' 
			&& prop.custom == true
			&& typeof prop.value !== 'undefined') {
			return prop.value
		} else if( typeof prop.default !== 'undefined') {
			return prop.default;
		} else {
			/* Not found */
			return null;
		}
	} else {
		/* Check with if(runner != null) {} */
		return null;
	}
}

/* This wraps game init code. */
/*
hgSetupValues(function(){
	// At this point the global gameData object should be ready, so init game. 

	var order = hgGet( 'options.levelOrder' );
	if( order != null ) {
		console.log( 'order', order );
	}
	// Example preload (goes in GameScene preload) 
	for( var imageID in gameData.images ) {
		var asset = hgGet( 'images.' + imageID );
		if( asset != null ) {
			console.log( imageID, asset );
			//this.load.image( imageID, asset );
		} else {
			// Shouldn't happen but we should display a whoops. 
		}
	}
});

*/


