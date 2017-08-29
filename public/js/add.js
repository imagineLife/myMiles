//send for and return the API serach results
function getResFromAPI(searchVal, callback) {
	let searchParams = '';
	let searchSnippet = '';

	for (i = 0; i < searchVal.length; i++){
		let resObj = searchVal[i];
		let firstItem = Object.keys(resObj)[0];
	    let itemName = Object.keys(resObj)[0];
	    let itemVal = resObj[Object.keys(resObj)[0]];        
	    searchSnippet = '&' + itemName + '=' + itemVal;
		searchParams += searchSnippet;
	  }

	  console.log(searchParams);
	}


	// const infoSettings = {
	//   url: getRecipesURI+`${searchParams}`,  
	//   dataType: 'json',
	//   success: callback,
	//   error: function(err) { alert(err); },
	//   beforeSend: function(xhr) {
	//     xhr.setRequestHeader("X-Mashape-Authorization", "Dw5Du2x9f1mshumfYcTmv8RduW9Op1On2QIjsnwkVvyQwCuMSb");
	//   }
	// };

	// $.ajax(infoSettings);
// };

function parseFormInputs(){
	let arrInputVals = [];
	let objInputVal = {};

	$('#form input').each(function() {
		if( this.value == '') {
	    }else{
		    let inputKey = this.name;
		    let inputVal = this.value;
		    
		    objInputVal[inputKey] = inputVal;

		    arrInputVals.push(objInputVal);
	    }
	})

	// console.log(arrInputVals);
	getResFromAPI(arrInputVals);//, displayAPISearchData);
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