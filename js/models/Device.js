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

		this.version = [3]
		this.channelCount = 2
		this.channels = []
		this.config = ""
		this.lastUpdated = -1
		
	}

	getConfig() {

		if (this._object.connected) {

			var self = this

			console.log(this._object)

			var call = lights.app.particle.getVariable({ deviceId: this._object.id, name: 'config', auth: lights.app.particle.auth.accessToken })

			call.then(function(data) {

				console.log('Device variable retrieved successfully:', data)
				self.config = data.body.result
				console.log(self.config, self.config.length)

				self.lastUpdated = Date.now()

				self.parseConfig()

			}, function(err) {

				console.log('An error occurred while getting attrs:', err)

			})

		} else {

			console.log("Device ", this._object.id, "not connected")
		}

	}

	parseConfig() {

		// Check data length
		if (this.config.length == 158) {

			console.log("Data length checked, parsing config")

			var configArray = []

			// Construct and print out a semi-legible lights config
			for (var i = 0; i < this.config.length; i++) {

				if (this.config.substring(i, i + 1) != 'c' && this.config.substring(i, i + 1) != 't'){
					configArray.push(parseInt(this.config.charCodeAt(i)) - 1)
				} else {
					configArray.push(this.config.substring(i, i + 1))
				}

			}

			console.log(configArray)

			// Get device software version, always subtract 1 to get actual value since we can't send 0
			this.version[0] = parseInt(this.config.charCodeAt(0)) - 1
			console.log('versionMajor', this.version[0])
			this.version[1] = parseInt(this.config.charCodeAt(1)) - 1
			console.log('versionMinor', this.version[1])
			this.version[2] = parseInt(this.config.charCodeAt(2)) - 1
			console.log('versionPatch', this.version[2])

			// Get channelCount
			this.channelCount = parseInt(this.config.charCodeAt(3)) - 1
			console.log('channelCount', this.channelCount)

			if (this.channels.length != this.channelCount) {

				this.channels = []

				for (var i = 0; i < this.channelCount; i++) {

					this.channels.push(new lights.Channel())

				}
				

			}

			
			// The next byte (4) specifies content length, which we can skip
			var configPos = 4
			configPos++

			// The next byte specifies the function being called which we use to check if the config is formed correctly
			if (this.config.substring(configPos, configPos + 1) === 'c') {

				configPos++

				// Check which channels are on/off and create Channel object
				for (var i = 0; i < this.channelCount; i++) {

					if (lights.app.getBitValueAt(this.config.charCodeAt(configPos), 7 - i) === 1) {

						console.log("Channel", i, "is on")
						this.channels[i].isOn = true

					} else {

						console.log("Channel", i, "is off")
						this.channels[i].isOn = false

					}

				}

				// The next three bytes give the interpolation time.
				// Since we send a new value according to the user's preferences, this value is ignored

				configPos += 4

				// The next bytes hold the color data in pairs of two bytes
				for (var i = 0; i < this.channelCount; i++) {

					for (var j = 0; j < 3; j++) {

						this.channels[i].rgb[j] = lights.app.combineBytes([this.config.charCodeAt(configPos) - 1, this.config.charCodeAt(configPos + 1) - 1])
						configPos += 2

					}

				}

				console.log(this)

			} else {

				throw new Error('Color function specifier not in correct position in config')

			}

		} else {

			throw new Error('Config length incorrect, try refreshing device config')

		}

	}

	encodeColors(rgb) {

		if (this._object.connected) {
			// Function declaration for color data
			var payload = 'c'
			console.log(rgb)

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

			call.then(function(data) {

					console.log('Function called succesfully:', data)

				}, function(err) {

					console.log('An error occurred:', err)

				})

		} else {

			console.log("Device ", this._object.id, "not connected")
		}

	}

}

window.lights.Device = Device