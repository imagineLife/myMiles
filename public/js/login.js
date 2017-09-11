function moveToTripsPage(res){
	window.location.href = '/trips?id='+res.id;
}

function getResFromAPI(obj){
	let loginURL = '/api/auth/login';

		const infoSettings = {
	    url: loginURL,
	    // url: getUserTripsURL+`{}`
	    type: 'POST',
	    contentType: 'application/json',
	    data: JSON.stringify(obj),  
	    success: function(res){moveToTripsPage(res)},
	    error: function(err) { console.log(err) }
	};

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