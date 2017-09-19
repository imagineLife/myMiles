const postTripURI = `/api/trips`;
//send for and return the API serach results
function showMyTrips(trip){
	window.location.href = '/trips';
}

function sendTripToAPI(searchVal) {

	const infoSettings = {
	    url: postTripURI,
	    type: 'POST',
	    beforeSend: req => {
	    	req.setRequestHeader('Authorization', 'Bearer ' + Cookies.get('authToken'));
	  	},
	    contentType: 'application/json',
	    data: JSON.stringify(searchVal),  
	    success: showMyTrips,
	    error: function(err) { console.log(err) }
	};

	$.ajax(infoSettings);
};


function parseFormInputs(){
	let objInputVal = {};

	$('#form input').each(function() {
		if( this.value == '') {
	    }else{
		    let inputKey = this.name;
		    let inputVal = this.value;
		    
		    objInputVal[inputKey] = inputVal;
	    }
	})

	sendTripToAPI(objInputVal);
}

function validateCorrectInputCount(inputVals){
    if(Object.keys(inputVals).length == 2){
    	parseFormInputs();
    }else{
    	console.log('not enought inputs');
    }
}

//Gathers form input values on Submit-Click
//and passes values to a validation function (checkInputs)
$("#form")
	.on('click', '#submit', (ev) =>{
		ev.preventDefault();

	    let inputList = $('#form input');
	    let inputVals = {};
	    
	    for (i = 0; i < inputList.length; i++){
	    	if(inputList[i].value == ''){}else{
	      		inputVals[i] = inputList[i].value;
	      	}
	    };

	    validateCorrectInputCount(inputVals);

	})