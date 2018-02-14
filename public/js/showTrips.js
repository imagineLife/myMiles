const getTripURI = `/api/trips/`;
// const editTripURI = `/api/trips/:id`;

function getResFromAPI() {
	const infoSettings = {
      url: getTripURI,  
      dataType: 'json',
	  beforeSend: req => {
	    req.setRequestHeader('Authorization', 'Bearer ' + Cookies.get('authToken'));
	  }
    };

    $.ajax(infoSettings)
    	.then(generateTableHTML)
    	.catch((err)=>{
    		console.log(err);
    		window.location.href="/login";
    	});
}

function updateAPI(type,data){
	console.log('type is ',type);
	console.log('data is ',data);
}

function generateTableHTML(data){
	let rowsHTML = '';
	let totalMilesTraveled = 0;


	for(let i=0; i<data.length; i++){
		const currentData = data[i];
		// console.log('currentData ->',currentData);
		let parsedDate = currentData.date.slice(0, 10);

		const rowHTML = (
			`<tr>
	            <td>${parsedDate}</td>
	            <td>
	            	<span class="mileValue" name="mileValue" data-id="${currentData._id}" value="${currentData.milesTraveled}">
	            		${currentData.milesTraveled}
	            	</span>
	            	<button class="submitCheckbox">√</button>
	            	<button class="deleteRow">Delete</button>
	            	<button class="closeX">X</button>
	            </td>
	          </tr>`
	          );

		rowsHTML = rowsHTML + rowHTML;
		totalMilesTraveled = totalMilesTraveled + currentData.milesTraveled;
	}

	displayTable($('.trip-table-body'), rowsHTML, $('.trip-table-total-miles'), totalMilesTraveled);
}

//Selecting the Mile Number to edit
$('.trip-table-body')
	.on('click','span', function(e){

		//close any input that is currently open
		closeInput();	

		//remove current content from html
		$(this).html('');

		//convert input into span
		$(this).closest('td').html(
			$(this).closest('td').html().replace(/span/g,'input')
		)

	})

	.on('click','button.submitCheckbox', function(){

	//Pull data from table cell
		let curTripID = $(this).siblings('input').data("id");
		let inputVal = $(this).siblings('input').val();
	//build data Object
		let data = { milesTraveled : inputVal };
		console.log('data is ->',data);

	// $.post( '/editTrip/', {miles: $(this).siblings('input').val(), tripID:$(this).siblings('input').data("id"))  } 
	})

	.on('click','button.closeX', function(){
		closeInput();
	});

		/*
			add check-mark submit
			add x-cancel
			add listeners to these
			make input-to-span conversion for after editing cell
			disable multiple inputs @ same time 
		*/


//converts an open input to a span
function closeInput(){
	$('input.mileValue').each(function(){

		//pull data value out of element
			let origVal = $(this)[0].value;
			let tData = $(this).closest('td');
			let dataID = $(this).data('id');

		//set span value back to value
			$(this).replaceWith(`<span class='mileValue' name='mileValue' data-id=${dataID} value=${origVal}>`+origVal+`</span>`);

		})

}

function displayTable(tBodyElem, rowsHTML, tTotalElem, totMiles){
	tBodyElem.append(rowsHTML);
	tTotalElem.text(totMiles);
}

function redirectToAdd(user){
	Cookies.set('authToken', user.authToken);
	window.location='/add'
}

function gainAccessToAddTrips(){
	const addTripsURI = `/api/auth/add`;

	const infoSettings = {
	    url: addTripsURI,
	    beforeSend: req => {
			req.setRequestHeader('Authorization', 'Bearer ' + Cookies.get('authToken'));
		},
  	    contentType: 'application/json'
  	};

	$.ajax(infoSettings)
		.then(redirectToAdd)
		.catch((err)=>console.log(err));
}

$('form')
	.on('click', 'button', (ev) => {
		ev.preventDefault();
		gainAccessToAddTrips();
	})

$(getResFromAPI);