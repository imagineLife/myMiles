const getTripURI = `/api/trips/`;

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

function generateTableHTML(data){
	let rowsHTML = '';
	let totalMilesTraveled = 0;


	for(let i=0; i<data.length; i++){
		const currentData = data[i];
		let parsedDate = currentData.date.slice(0, 10);

		const rowHTML = (
			`<tr>
	            <td>${parsedDate}</td>
	            <td>${currentData.milesTraveled}</td>
	          </tr>`
	          );

		rowsHTML = rowsHTML + rowHTML;
		totalMilesTraveled = totalMilesTraveled + currentData.milesTraveled;
	}

	displayTable($('.trip-table-body'), rowsHTML, $('.trip-table-total-miles'), totalMilesTraveled);
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