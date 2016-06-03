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
			value += getItemTpl(data[i].datetime, data[i].lat, data[i].lng, data[i].radius, data[i].status);
		}
		$('#submissionCollection').append(value);
		// if(data == 'Submission Success'){
		// 	window.location="submissions.html";
		// }else{

		// }

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

function getItemTpl(datetime, lat, lng, radius, status){
	var value = '<a onclick="serviceSingleSubmission()">';
	value += '<li class="collection-item avatar">';
	if(status == '0'){
		value += '<i class="material-icons circle red">repeat</i>';
	}else{
		value += '<i class="material-icons circle green">done</i>';
	}
	value += '<span class="title">'+
		parseTwitterDate(datetime) +
		'</span>' +
		'<p>' +
		parseFloat(lat).toFixed(2) + ', ' + parseFloat(lng).toFixed(2) +
		'<br/>' +
		'Radius: ' +
		radius +
		'</p>' +
		'</li>'+
		'</a>';
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