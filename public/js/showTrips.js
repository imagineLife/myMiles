const getTripURI = `/api/trips/`;
const editTripURI = `/api/trips/`;

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
	
	//begin api data object build
	const apiData = {  
      dataType : 'json',
      url : editTripURI + data._id,
      data: JSON.stringify(data)
    };

    //Updating a row
	if(type=="update"){	
		console.log('will send as update');
		console.log('apiObj ->',apiData);
	
	//Deleting a row
	}else{
		console.log('will send as delete');
	}
}

function generateTableHTML(data){
	let rowsHTML = '';
	let totalMilesTraveled = 0;


	for(let i=0; i<data.length; i++){
		const currentData = data[i];
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

//When selecting the distance, convert cell to an editable input
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

//when selecting a button in the editing section
	.on('click','button', function(){

	//Pull data from table cell
		let curTripID = $(this).siblings('input').data("id");
		let inputVal = $(this).siblings('input').val();
	//build data Object
		let data = { _id : curTripID,milesTraveled : inputVal };

		switch( $(this).attr('class') ){

			case "submitCheckbox":
				updateAPI("update",data);
				break;

			case "deleteRow":
				console.log('delete clicked');
				updateAPI("delete",data);
				break;

			default :
				closeInput();
				break;
			// $.post( '/editTrip/', {miles: $(this).siblings('input').val(), tripID:$(this).siblings('input').data("id"))  }
		
		}

	})
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
			let attrs = $(this).attr("value");
			let tData = $(this).closest('td');
			let dataID = $(this).data('id');

		//set span value back to value
			$(this).replaceWith(`<span class='mileValue' name='mileValue' data-id=${dataID} value=${attrs}>`+attrs+`</span>`);

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