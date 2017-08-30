const postTripURI = `/add`;
//send for and return the API serach results
function tellMeItWorks(){
	console.log('it worked!');
}

function getResFromAPI(searchVal) {

	console.log('searchVal is ',searchVal);
	const infoSettings = {
	    url: postTripURI,
	    type: 'POST',
	    // contentType: 'application/json',
	    // data: JSON.stringify(searchVal),  
	    data: searchVal,
	    success: tellMeItWorks,
	    error: function(err) { console.log(err) }
	};

	// // console.log(infoSettings);
	$.ajax(infoSettings);
};

function parseFormInputs(){
	let arrInputVals = [];
	let objInputVal = {};

	$('#form input').each(function() {
		if( this.value == '') {
	    }else{
		    let inputKey = this.name;
		    let inputVal = this.value;
		    
		    objInputVal[inputKey] = inputVal;
	    }
	})

	arrInputVals.push(objInputVal);

	// console.log(objInputVal);
	getResFromAPI(objInputVal);//, displayAPISearchData);
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