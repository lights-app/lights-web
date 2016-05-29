'use strict';

class Device extends lrs.LRSObject {

	static fromParticleDevice(device) {

		var attributes = device

		let parsedName = device.name.split("||")

		if (parsedName[0] === "Lights") {

			attributes.roomName = parsedName[1]
			attributes.isLightsDevice = true

		} else {

			attributes.roomName = device.name
			attributes.isLightsDevice = false

		}

		return new this(attributes)

	}
	
	constructor(attributes) {

		super()

		for (let attributeName of Object.keys(attributes)) {

			this[attributeName] = attributes[attributeName]

		}

		this.channelCount = 2
		
	}

	encodeColors(rgb) {

		if (this._object.connected) {
			// Function declaration for color data
			var payload = 'c'

			// All channels on, for now
			payload += String.fromCharCode(127)

			// Split interpolation time into 3 bytes
			var interpolationTime = lights.app.splitBytes(7, 3, true)

			payload += String.fromCharCode(interpolationTime[0])
			payload += String.fromCharCode(interpolationTime[1])
			payload += String.fromCharCode(interpolationTime[2])

			for (var i = 0; i < this.channelCount * 3; i++) {

				var colorBytes = lights.app.splitBytes(rgb[i] * ((Math.pow(127, 2) - 1 ) / 255), 2, true)

				payload += String.fromCharCode(colorBytes[0])
				payload += String.fromCharCode(colorBytes[1])

			}

			console.log("Payload length", payload.length)
			console.log("Payload ", payload)

			console.log(this)

			var call = lights.app.particle.callFunction({ deviceId: this._object.id, name: 'lights', argument: payload, auth: lights.app.particle.auth.accessToken })

			call.then(
				function(data) {
					console.log('Function called succesfully:', data);
				}, function(err) {
					console.log('An error occurred:', err);
				})

		} else {

			console.log("Device ", this._object.id, "not connected")
		}

	}

}

window.lights.Device = Device