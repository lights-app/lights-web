var particle = new Particle();
var token = localStorage.getItem('accessToken')
var deviceId = localStorage.getItem('deviceId')
$('#deviceid').val(deviceId)

if(token === null) {

	$('#variables').addClass('hidden')

} else {

	$('#account-info').addClass('hidden')
	$('#variables').removeClass('hidden')

}

$('#log-in').on('click tap', function() {

	particleLogin()

})

$('#on-btn').on('click tap', function() {

	var payload = encodeData([16128, 10000, 0, 16128, 10000, 0])

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

$('#off-btn').on('click tap', function() {

	var payload = encodeData([0, 0, 0, 0, 0, 0])
	
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

	var payload = encodeData(getColorValues())

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

	var colors = []
	var i = 0

	$('.color').each(function(obj) {

		var val = parseInt($(this).val())
		colors[i] = val
		i++

	})

	console.log(colors)

	encodeData(getColorValues())

})

function getColorValues(){

	var colors = []
	var i = 0

	$('.color').each(function(obj) {

		var val = parseInt($(this).val())
		colors[i] = val
		i++

	})

	return colors

}

function encodeData(colors) {

	var payload = 'c'

	payload += String.fromCharCode(127)

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

	colors.forEach(function(obj) {

		var val = obj

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

	

	console.log('Payload', payload)
	console.log('Payload length', payload.length)

	return payload

}

$('#encode-timer-data').on('click tap', function() {

	var payload = encodeTimerData()
	
	console.log(payload)
	console.log("Payload length", payload.length)

})

$('#send-timer-data').on('click tap', function() {

	var payload = encodeTimerData()

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

function encodeTimerData() {

	var payload = 't'

	payload += String.fromCharCode(parseInt($('#timer-selector').val())  + 1)
	payload += String.fromCharCode(parseInt($('#zero-point-selector').val()) + 1)

	var zeroPointOffset = splitNumber(parseInt($('#zero-point-offset').val()), 3)
	payload += String.fromCharCode(zeroPointOffset[0] + 1)
	payload += String.fromCharCode(zeroPointOffset[1] + 1)
	payload += String.fromCharCode(zeroPointOffset[2] + 1)

	var interpolationTime = splitNumber(parseInt($('#timer-interpolation-time').val()), 3)
	payload += String.fromCharCode(interpolationTime[0] + 1)
	payload += String.fromCharCode(interpolationTime[1] + 1)
	payload += String.fromCharCode(interpolationTime[2] + 1)

	payload += String.fromCharCode(parseInt($('#mode').val()) + 1)

	$('.timer-color').each(function(obj) { 
		console.log($(this).val())
		var colVal = splitNumber(parseInt($(this).val()), 2)
		payload += String.fromCharCode(colVal[0] + 1)
		payload += String.fromCharCode(colVal[1] + 1)

	})

	return payload

}

function splitNumber(numberToSplit, amountOfBytes){

	var bytes = [];

	for (var i = 0; i < amountOfBytes; i ++) {

		bytes[i] = Math.floor(numberToSplit / Math.pow(127, (amountOfBytes - i - 1)))
		numberToSplit -= bytes[i] * Math.pow(127, (amountOfBytes - i - 1))
		// console.log(numberToSplit, bytes[i])

	}

	return bytes

}