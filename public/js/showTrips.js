const getTripURI = `/api/trips/`;

function getResFromAPI() {
	let idParam = (new URL(document.location)).searchParams;
	let id = idParam.get("id");

	const infoSettings = {
      url: getTripURI+id,  
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

function redirect(user){
	Cookies.set('authToken', user.authToken);
	console.log(Cookies.get('authToken'));
	window.location='/trips?id='+user._id;
}

function gainAccessToAddTrips(userID){
	const addTripsURI = `/api/auth/add`;
	//USE userID & pass it to addTrips?!

	const infoSettings = {
	    url: addTripsURI,
	    beforeSend: req => {
			req.setRequestHeader('Authorization', 'Bearer ' + Cookies.get('authToken'));
		},
  	    contentType: 'application/json'
  	};

	$.ajax(infoSettings)
		.then(console.log('got access to the api/auth/add!!'))
		.catch((err)=>console.log(err));
}

$('form')
	.on('click', () => {
		let idParam = (new URL(document.location)).searchParams;
		let id = idParam.get("id");
		console.log('userID is '+id);
		gainAccessToAddTrips(id);
	})

$(getResFromAPI);