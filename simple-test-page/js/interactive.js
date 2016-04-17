var particle = new Particle();
var token
var payload = ''

particle.login({username: $('#username').val(), password: $('#password').val()}).then( function(result) {

	console.log(result)
	token = result.body.access_token

}).catch( function(err) {

	// window.alert('Something went wrong')
	console.log('Something went wrong')

})

$('#send').on('click tap', function() {

	encodeData()

	var deviceId = $('#deviceid').val()

	var fnPr = particle.callFunction({ deviceId: deviceId, name: 'lights', argument: payload, auth: token })

	fnPr.then(

		function(data) {

			console.log('Function called succesfully:', data)

		}, function(err) {

			console.log('An error occurred:', err)

	})

})

$('#encode-data').on('click tap', function() {

	encodeData()

})

function encodeData() {

	payload = 'c'

	payload += String.fromCharCode(127)

	$('.color').each(function(obj) {

		var val = $(this).val()

		// If the value exceeds the maximum allowed, cut off
		// Since we can't send '0', the range is 127 values per byte (1-127)
		if (val > 127 * 127) {

			val = 127 * 127

		}

		var highByte = Math.floor(val / 127)
		var lowByte = val - (highByte * 127)

		console.log('High Byte', highByte)
		console.log('Low Byte', lowByte)

		payload += String.fromCharCode(highByte)
		payload += String.fromCharCode(lowByte)

	})

	payload += String.fromCharCode(1)
	payload += String.fromCharCode(1)
	payload += String.fromCharCode($('#interpolationtime').val())

	console.log('Payload', payload)
	console.log('Payload length', payload.length)

}