//Gathers form input values on Submit-Click
//and passes values to a validation function (checkInputs)
$("#form")
	.on('click', '#submit', (ev) =>{
		ev.preventDefault();

		let inputList = $('#form input');
		let inputVals = {};
		for (i = 0; i < inputList.length; i++){
			inputVals[i] = inputList[i].value;
		}
		console.log('inputVals are ', inputVals);

	//checkInputs(inputVals);
	})