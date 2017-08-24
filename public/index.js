const getTripURI = `https://localhost:8080/trips`;

function getResFromAPI() {
	const infoSettings = {
      url: getTripURI,  
      dataType: 'json',
      success: callback,
      error: function(err) { alert(err); },
    };

    $.ajax(infoSettings);
    return data;
}

function displayAPISearchData(data){
	console.log(data);
}

function doEverything(){
	//get request to '/trips'
	//output results into table rows
	getResFromAPI();
	displayAPISearchData();
}
$(doEverything);