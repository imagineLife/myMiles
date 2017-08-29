function validateCorrectInputCount(inputVals){
    if(Object.keys(inputVals).length == 2){
    	console.log('enough inputs!!');
    	// parseFormInputs();
    }else{
    	console.log('not enought inputs');
    }
}

//Gathers form input values on Submit-Click
//and passes values to a validation function (checkInputs)
$("#form")
	.on('click', '#submit', (ev) =>{
		ev.preventDefault();

	    let inputList = $("#form input");
	    let inputVals = {};
	    
	    for (i = 0; i < inputList.length; i++){
	    	if(inputList[i].value == ''){}else{
	      		inputVals[i] = inputList[i].value;
	      	}
	    };

	    // validateCorrectInputCount(inputVals);

	})