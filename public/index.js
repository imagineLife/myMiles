const getTripURI = `/trips`;

function getResFromAPI() {
	const infoSettings = {
      url: getTripURI,  
      dataType: 'json',
      success: displayAPISearchData,
      error: function(err) { console.log(err) },
    };

    $.ajax(infoSettings);
}

function displayAPISearchData(data){
	console.log(data);
}

function doEverything(){
	//get request to '/trips'
	//output results into table rows
	getResFromAPI();
}

$(doEverything);