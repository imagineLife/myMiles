//Gathers form input values on Submit-Click
//and passes values to a validation function (checkInputs)
$("#form")
	.on('click', '#register', (ev) =>{
		ev.preventDefault();

	    let inputList = $('#form input');
	    let inputVals = {};
	    
	    for (i = 0; i < inputList.length; i++){
	    	if(inputList[i].value == ''){}else{
	      		inputVals[i] = inputList[i].value;
	      	}
	    };

	    console.log(inputVals);
	    // validateCorrectInputCount(inputVals);
	})