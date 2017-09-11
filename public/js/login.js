function moveToTripsPage(response){
	console.log('res is \n',
		response);
	window.location.href = '/trips';
}

function getResFromAPI(obj){
	// console.log(obj)
	//API url
	let loginURL = '/api/auth/login';
	// let getUserTripsURL = '/api/trips/';

		const infoSettings = {
	    url: loginURL,
	    // url: getUserTripsURL+`{}`
	    type: 'POST',
	    contentType: 'application/json',
	    data: JSON.stringify(obj),  
	    success: function(response){
	    	moveToTripsPage(response);
	    },
	    error: function(err) { console.log(err) }
	};

	// console.log(infoSettings);
	$.ajax(infoSettings);
}

//Gathers form input values on Submit-Click
//and passes values to get the API results
$("#form")
	.on('submit', (ev) =>{
		ev.preventDefault();

	let arrInputVals = [];
	let objInputVal = {};

	$('.form input').each(function() {
		if( this.value == '') {
	    }else{
		    let inputKey = this.name;
		    let inputVal = this.value;
		    
		    objInputVal[inputKey] = inputVal;
	    }
	})

	getResFromAPI(objInputVal);
	})