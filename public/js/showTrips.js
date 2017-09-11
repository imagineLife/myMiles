const getTripURI = `/api/trips/`;

function getResFromAPI() {
	let params = (new URL(document.location)).searchParams;
	let id = params.get("id");
	console.log(id);

	const infoSettings = {
      url: getTripURI+id,  
      dataType: 'json',
      success: generateTableHTML,
      error: function(err) { console.log(err) },
    };

    $.ajax(infoSettings);
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

$(getResFromAPI);


          