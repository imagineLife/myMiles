const getTripURI = `/trips`;

function getResFromAPI() {
	const infoSettings = {
      url: getTripURI,  
      dataType: 'json',
      success: generateTableRows,
      error: function(err) { console.log(err) },
    };

    $.ajax(infoSettings);
}

function generateTableRows(data){
	let rowsHTML = '';


	for(let i=0; i<data.length; i++){
		const currentData = data[i];
		const rowHTML = (
			`<tr>
	            <td>${currentData.date}</td>
	            <td>${currentData.milesTraveled}</td>
	          </tr>`
	          );

		rowsHTML = rowsHTML + rowHTML;
	}

	console.log(rowsHTML);
}

function doEverything(){
	//get request to '/trips'
	//output results into table rows
	getResFromAPI();
}

$(doEverything);


          