HOST = 'https://get-more-business.herokuapp.com/';

$('#us3').locationpicker({
	location: {
	    latitude: 42.279025, 
	    longitude: -83.025602
	},
	radius: 3000,
	inputBinding: {
	    latitudeInput: $('#us3-lat'),
	    longitudeInput: $('#us3-lon'),
	    radiusInput: $('#us3-radius'),
	    locationNameInput: $('#us3-address')
	},
	enableAutocomplete: true,
	onchanged: function (currentLocation, radius, isMarkerDropped) {
	    // Uncomment line below to show alert on each Location Changed event
	    //alert("Location changed. New location (" + currentLocation.latitude + ", " + currentLocation.longitude + ")");
	}
});
if($('#submitButton').length > 0){
	document.getElementById("submitButton").onclick = submitButton;
}
if($('#search').length > 0){
	document.getElementById("search").onkeyup = search;
}
function search(){
	$('#search').val()

	$('#loader').attr('class', 'preloader-wrapper active')
	$.post(HOST + "getplaces",
	{
		search: $('#search').val(),
	},
	function(data, status){
		console.log(data)
		$('#loader').hide();
		$('#searchCollection').empty();
		var value = '';
		for(var i=0; i<data.length; i++){
			value += getItemTpl(data[i].name, data[i].lat, data[i].lng, data[i].status, '200', data[i].icon, data[i].place_id);
		}
		$('#searchCollection').append(value);

	});
	

}
function submitButton(){
	$('#loader').attr('class', 'preloader-wrapper small active')
	$.post(HOST + "submit",
	{
		lat: $('#us3-lat').val(),
		lng: $('#us3-lon').val(),
		radius: $('#us3-radius').val()
	},
	function(data, status){

		if(data == 'Submission Success'){
			window.location="submissions.html";
		}else{

		}

	});
}

if($('#submissionCollection').length > 0){
	$.post(HOST + "getsubmissions",
	{
	},
	function(data, status){
		$('#loader').hide();
		console.log(data)
		var value = '';
		for(var i=0; i<data.length; i++){
			value += getItemTpl(data[i].datetime, data[i].lat, data[i].lng, data[i].radius, data[i].status, '', '');
		}
		$('#submissionCollection').append(value);
	});
}

function serviceSingleSubmission(){
	$('#loader').attr('class', 'preloader-wrapper active')
	$.post(HOST + "serviceSingleSubmission",
	{
	},
	function(data, status){
		window.location="submissions.html";
	});
}
function getsingleplace(place_id){
	console.log('place_id: ' + place_id)
	$.post(HOST + "getsingleplace",
	{
		place_id: place_id
	},
	function(data, status){
		console.log(data)
		var data = JSON.parse(data[0].json2);
		console.log(data)
		var data = data.result;
		console.log(data)

		var reviewHtml = '<b>Reviews: </b><br/>';
		if(data.reviews != undefined){
			for(var i=0; i<data.reviews.length; i++){
				if(data.reviews[i].profile_photo_url != undefined)
				reviewHtml += '<img src="' + data.reviews[i].profile_photo_url + '" height=30px width=auto>';
				reviewHtml += '<b>' + data.reviews[i].author_name + '</b>: ' + data.reviews[i].text + '<br>';

			}
		}
		
		var openinghoursHtml = '<b>Opening Hours: </b><br/>';
		if(data.opening_hours != undefined){
			if(data.opening_hours.weekday_text != undefined){
				for(var i=0; i<data.opening_hours.weekday_text.length; i++){
					openinghoursHtml += data.opening_hours.weekday_text[i] + '<br>';

				}
			}
		}

		swal({   
			title: data.name,   
			text: '<b>Website: </b><a href="' + data.website + '" target="_blank"> ' + data.website + ' </a><br/>' +
					'<b>Address: </b>' + data.formatted_address + '<br/>' +
					'<b>Phone: </b>' + data.formatted_phone_number + '<br/>' + '<br/>' +
					openinghoursHtml + '<br/>' +
					reviewHtml
					,   
			html: true 
		});
	});
}

function getItemTpl(datetime, lat, lng, radius, status, icon, place_id){
	var value = '<a onclick="serviceSingleSubmission()">';
	if(status == '200'){
		value = '<a onclick="getsingleplace(\'' + place_id + '\')">';
	}
	value += '<li class="collection-item avatar">';
	var parsedDateTimeValue = parseTwitterDate(datetime);
	var parsedRadius = 'Radius: ' + radius;
	if(status == '0'){
		value += '<i class="material-icons circle red">repeat</i>';
	}else if(status == '1'){
		value += '<i class="material-icons circle green">done</i>';
	}else if(status == '200'){
		value += '<img src="' + icon + '" alt="" class="circle">';
		parsedDateTimeValue = datetime;
		parsedRadius = 'Status: ' + radius;
	}
	value += '<span class="title">'+
		parsedDateTimeValue +
		'</span>' +
		'<p>' +
		parseFloat(lat).toFixed(2) + ', ' + parseFloat(lng).toFixed(2) +
		'<br/>'+
		parsedRadius+
		'</p>' +
		'</li>';

	return value;
}

function parseTwitterDate(tdate) {
    var system_date = new Date(Date.parse(tdate));
    var user_date = new Date();
    if (K.ie) {
        system_date = Date.parse(tdate.replace(/( \+)/, ' UTC$1'))
    }
    var diff = Math.floor((user_date - system_date) / 1000);
    if (diff <= 1) {return "just now";}
    if (diff < 20) {return diff + " seconds ago";}
    if (diff < 40) {return "half a minute ago";}
    if (diff < 60) {return "less than a minute ago";}
    if (diff <= 90) {return "one minute ago";}
    if (diff <= 3540) {return Math.round(diff / 60) + " minutes ago";}
    if (diff <= 5400) {return "1 hour ago";}
    if (diff <= 86400) {return Math.round(diff / 3600) + " hours ago";}
    if (diff <= 129600) {return "1 day ago";}
    if (diff < 604800) {return Math.round(diff / 86400) + " days ago";}
    if (diff <= 777600) {return "1 week ago";}
    return "on " + system_date;
}

// from http://widgets.twimg.com/j/1/widget.js
var K = function () {
    var a = navigator.userAgent;
    return {
        ie: a.match(/MSIE\s([^;]*)/)
    }
}();