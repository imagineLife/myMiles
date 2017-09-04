function tellMeItWorks(){
	console.log('Worked!!');
}

function getResFromAPI(obj){
	//API url
	let registerURL = '/api/auth/login';

		const infoSettings = {
	    url: registerURL,
	    type: 'POST',
	    contentType: 'application/json',
	    data: JSON.stringify(obj),  
	    success: tellMeItWorks,
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