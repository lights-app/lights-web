var particle = new Particle();
var token = localStorage.getItem('accessToken')
var deviceId = localStorage.getItem('deviceId')
var particleDevices = []
var _selectedDevices = localStorage.selectedDevices || null
var selectedDevices = JSON.parse(_selectedDevices) || []

if(token === null) {

	$('#variables').addClass('hidden')

} else {

	$('#account-info').addClass('hidden')
	$('#variables').removeClass('hidden')
	listDevices()

}

$('#log-in').on('click tap', function() {

	particleLogin()

})

$('#on-btn').on('click tap', function() {

	var payload = encodeData([16128, 12537, 3087, 16128, 12537, 3087])

	sendPayload(payload)

})

$('#off-btn').on('click tap', function() {

	var payload = encodeData([0, 0, 0, 0, 0, 0])

	sendPayload(payload)

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

		listDevices()

	}).catch( function(err) {

		$('#account-info').removeClass('hidden')
		$('#variables').addClass('hidden')
		// window.alert('Something went wrong')
		console.log('Something went wrong')

	})

}

function listDevices() {

	var devicesPr = particle.listDevices({ auth: token })

	devicesPr.then(
		function(devices){

			console.log('Devices: ', devices);
			particleDevices = devices.body

			particleDevices.forEach(function(obj) {

				console.log(obj)

				var elem = document.createElement("li")
				var label = document.createElement("label")

				label.innerHTML = obj.name

				elem.appendChild(label)

				$(elem).attr("deviceId", obj.id)
				$(elem).addClass('device')

				if (selectedDevices.indexOf(obj.id) > -1) {

					$(elem).addClass('selected')

				}

				var list = document.getElementById("devices")

				list.appendChild(elem)

			})

		},

		function(err) {
			console.log('List devices call failed: ', err);
		}
		);
}

$('#devices').on('click tap', '.device', function() {

	console.log(this)

	$(this).toggleClass('selected')

	if($(this).hasClass('selected')) {

		selectedDevices.push($(this).attr('deviceId'))

	} else {

		var index = selectedDevices.indexOf($(this).attr('deviceId'))
		selectedDevices.splice(index, 1)

	}

	localStorage.selectedDevices = JSON.stringify(selectedDevices)

	console.log(selectedDevices)

})


$('#send').on('click tap', function() {

	var payload = encodeData(getColorValues())

	sendPayload(payload)

})

function sendPayload(payload) {

	$('.selected').each(function() {

		var thisDeviceId = $(this).attr('deviceId')

		var fnPr = particle.callFunction({ deviceId: thisDeviceId, name: 'lights', argument: payload, auth: token })

		fnPr.then(

			function(data) {

				console.log('Function called succesfully:', data)

			}, function(err) {

				console.log('An error occurred:', err)

			})

	})

}

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

	var payload = 'd'

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

	sendPayload(payload)

})

function encodeTimerData() {

	var payload = 'u'

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

$('#log-out').on('click tap', function() {

	delete localStorage.accessToken

	location.reload()

})

$('#get-variable').on('click tap', function() {

	$('.selected').each(function() {

		var thisDeviceId = $(this).attr('deviceId')

		var fnPr = particle.getVariable({ deviceId: thisDeviceId, name: 'config', auth: token })

		fnPr.then(

			function(data) {

				console.log('Function called succesfully:', data)

				console.log(data.body.result, data.body.result.length)

			}, function(err) {

				console.log('An error occurred:', err)

			})

	})

})