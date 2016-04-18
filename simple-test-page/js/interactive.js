var particle = new Particle();
var token = localStorage.getItem('accessToken')
var deviceId = localStorage.getItem('deviceId')
$('#deviceid').val(deviceId)
var payload = ''

if(token === null) {

	$('#variables').addClass('hidden')

} else {

	$('#account-info').addClass('hidden')
	$('#variables').removeClass('hidden')

}

$('#log-in').on('click tap', function() {

	particleLogin()

})

function particleLogin() {

	particle.login({username: $('#username').val(), password: $('#password').val()}).then( function(result) {

		console.log(result)
		token = result.body.access_token

		localStorage.setItem('accessToken', token)
		localStorage.setItem('username', $('#username').val())
		localStorage.setItem('password', $('#password').val())

		$('#account-info').addClass('hidden')
		$('#variables').removeClass('hidden')

		}).catch( function(err) {

			$('#account-info').removeClass('hidden')
			$('#variables').addClass('hidden')
		// window.alert('Something went wrong')
		console.log('Something went wrong')

	})

}


$('#send').on('click tap', function() {

	encodeData()

	deviceId = $('#deviceid').val()
	localStorage.setItem('deviceId', deviceId)

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

		var highByte = Math.floor(val / 127) + 1
		var lowByte = val - ((highByte - 1) * 127) + 1

		console.log('High Byte', highByte)
		console.log('Low Byte', lowByte)

		payload += String.fromCharCode(highByte)
		payload += String.fromCharCode(lowByte)

	})

	var val = $('#interpolationtime').val()

	var highByte = Math.floor(val / (127 * 127)) + 1
	val = val - ((highByte - 1) * (127 * 127))
	var highByte2 = Math.floor(val / 127) + 1
	val = val - ((highByte2 - 1) * 127)
	var lowByte = val + 1

	console.log("Interpolation values", highByte, highByte2, lowByte)

	payload += String.fromCharCode(highByte)
	payload += String.fromCharCode(highByte2)
	payload += String.fromCharCode(lowByte)

	console.log('Payload', payload)
	console.log('Payload length', payload.length)

}