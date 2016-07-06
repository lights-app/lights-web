class Device extends Model {

	static fromParticleDevice(device) {

		var attributes = device

		let parsedName = device.name.split("__")

		if (parsedName[0] === "Lights") {

			// Replace all remaining underscores with spaces.
			// Underscores are added by Particle as replacements for spaces when renaming a device
			parsedName[1] = parsedName[1].replace(new RegExp('_', 'g'), " ")
			attributes.roomName = parsedName[1]
			attributes.isLightsDevice = true

		} else {

			// Replace all remaining underscores with spaces.
			// Underscores are added by Particle as replacements for spaces when renaming a device
			attributes.roomName = device.name.replace(new RegExp('_', 'g'), " ")
			attributes.isLightsDevice = false

		}

		return new this(attributes)

	}
	
	constructor(attributes) {

		super(attributes)

		this.version = [3]
		this.channelCount = 2
		this.channels = []

		for (var i = 0; i < this.channelCount; i++) {

			this.channels.push(new lights.Channel([0,0,0]))

		}

		this.timerCount = 8
		this.timers = []
		
		this.config = ""
		this.lastUpdated = -1
		
	}

	getConfig() {

		if (this.connected) {

			var self = this

			var call = lights.app.particle.getVariable({ deviceId: this.id, name: 'config' })

			call.then(function(data) {

				self.config = data.body.result

				self.lastUpdated = Date.now()

				if(self.parseConfig()) {

					setTimeout( () => {

					// Each time we get a new config we also trigger the deviceConfigChanged event
					var event = new CustomEvent('deviceConfigChanged', {
							detail: {
								id: self.id
							}
						})

						document.dispatchEvent(event)

					}, 0)

					return true 

				}

			}, function(err) {

				console.log('An error occurred while getting attrs:', err)

				return false

			})

		} else {

			console.log("Device ", this.id, "not connected")
			return false
		}

	}

	parseConfig() {

		// Check data length
		if (this.config.length == 158) {

			var configArray = []
			var tempConfig = ""

			// Subtract 1 from all values and construct and print out a semi-legible lights config
			// JavaScript can handle multiple null characters in a string
			for (var i = 0; i < this.config.length; i++) {

				// Subtract 1 from received value
				tempConfig += String.fromCharCode(this.config.substring(i, i + 1).charCodeAt(0) - 1)

				if (this.config.substring(i, i + 1) != 'd' && this.config.substring(i, i + 1) != 'u'){
					configArray.push(parseInt(this.config.charCodeAt(i)) - 1)
				} else {
					configArray.push(this.config.substring(i, i + 1))
				}

			}

			this.config = tempConfig

			// Get device software version
			this.version[0] = parseInt(this.config.charCodeAt(0))
			this.version[1] = parseInt(this.config.charCodeAt(1))
			this.version[2] = parseInt(this.config.charCodeAt(2))

			if (!lights.app.arraysEqual(this.version, lights.app.requiresParticleVersion)) {

				console.warn('version mismatch. required', lights.app.requiresParticleVersion, 'running, ', lights.app.devices.recordsById[this.id].version)
				console.log(lights.app.devices.recordsById[this.id].version)

				var event = new CustomEvent('deviceVersionMismatch', {
					detail: {
						id: this.id,
						device: this
					}
				})

				document.dispatchEvent(event)

			}

			console.log(this.version)

			// Get channelCount
			this.channelCount = parseInt(this.config.charCodeAt(3))

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

				// Check which channels are on/off
				// Channel states begin at bit 2 (2nd from the right) up to bit 7
				// That is why we look at bit position i+1
				for (var i = 0; i < this.channelCount; i++) {

					if (lights.app.getBitValueAt(this.config.charCodeAt(configPos), 7 - (i + 1)) === 1) {

						this.channels[i].isOn = true

					} else {

						this.channels[i].isOn = false

					}

				}

				// The next three bytes give the interpolation time.
				// Since we send a new value according to the user's preferences, this value is ignored

				configPos += 4

				// The next bytes hold the color data in pairs of two bytes
				for (var i = 0; i < this.channelCount; i++) {

					var colorArray = []

					for (var j = 0; j < 3; j++) {

						var val = 255 * lights.app.combineBytes([this.config.charCodeAt(configPos), this.config.charCodeAt(configPos + 1)]) / (Math.pow(127, 2) - 1)
						colorArray.push(val)
						configPos += 2

					}

					var color = new lights.Color(colorArray, 'rgb')

					this.channels[i] = color

				}

			} else {

				console.log('Color function specifier not in correct position in config')

			}

			// The next byte indicates the content length of the first timer
			for (var i = 0; i < this.timerCount; i++) {

				var contentLength = this.config.charCodeAt(configPos)

				configPos++

				var timer = new lights.DeviceTimer(this.config.substring(configPos, configPos + contentLength), this.channelCount)
				console.log(timer, timer.config.length)

				this.timers.push(timer)

				configPos += contentLength

			}

			return true

		} else {

			var configArray = []
			// Construct and print out a semi-legible lights config
			for (var i = 0; i < this.config.length; i++) {

				if (this.config.substring(i, i + 1) != 'd' && this.config.substring(i, i + 1) != 'u'){
					configArray.push(parseInt(this.config.charCodeAt(i)) - 1)
				} else {
					configArray.push(this.config.substring(i, i + 1))
				}

			}

			console.log(configArray)

			console.log('Config length incorrect, try refreshing device config')

			return false

		}

	}

	sendColorData(rgb) {

		if (this.connected) {

			// Assume that the rgb values are equal to the current state
			// As soon as a difference is found we can send the data
			var isEqual = true

			try {

				for (var i = 0; i < this.channelCount; i++) {

					for (var j = 0; j < this.channels[i].rgb.length; j++) {

						if (this.channels[i].rgbFloat[j].toFixed(3) !== rgb[i][j].toFixed(3)) {

							isEqual = false

						}

					}

					if (!isEqual) {

						var color = new lights.Color(rgb[i], 'rgb')

						// Set the light's current color to the new color
						this.channels[i] = color
					}

				}
			} catch (err) {

				isEqual = false

			}

			// If the color that we want to send is different from the current color of the light, send it
			if (!isEqual) {

				// Function declaration for color data
				var payload = 'c'

				// The byte indicating which channels should be on/off has to be at least 1 to avoid null termination issues
				// We construct a 6-channel bit string indicating which channels are on/off
				// A max of 6 channels, because we can't send 0, or values over 127 (7-Bit)
				// Channel 0-6, from right to left
				// e.g.: turning on only channel 3 would give the following bit string: 00010001
				// turning on all channels: 01111111
				// Note that the first bit (rightmost) is set to 0 now, but will become a 1 once we send the data
				var channelByte = 0

				for (i = 0; i < this.channelCount; i++){

					// Every bit further to the left is a power of 2 higher than the last.
					// If that channel should be on, we add the accompanying power of 2 value
					// e.g.: turning on channel 3 would mean adding 2^4 = 16 to channelByte
					if (this.channels[i].isOn) {

						channelByte += Math.pow(2, i + 1)

					}

				}

				// Let's set the chanelByte to 126 (all channels) for now
				channelByte = 126

				// Convert that number to a char
				payload += String.fromCharCode(channelByte)

				// Split interpolation time into 3 bytes
				// Multiply interpolation time by 10 to get from seconds to 10ths of seconds
				var interpolationTime = lights.app.splitBytes(lights.app.interpolationTime * 10, 3, false)

				payload += String.fromCharCode(interpolationTime[0])
				payload += String.fromCharCode(interpolationTime[1])
				payload += String.fromCharCode(interpolationTime[2])

				for (var i = 0; i < this.channelCount; i++) {

					for (var j = 0; j < 3; j++) {

						var colorBytes = lights.app.splitBytes(rgb[i][j] * ((Math.pow(127, 2) - 1 ) / 255), 2, false)

						payload += String.fromCharCode(colorBytes[0])
						payload += String.fromCharCode(colorBytes[1])

					}

				}

				var tempPayload = ""
				var tempArray = []

				// Increase every number by 1 to prevent null termination issues
				for(var i = 0; i < payload.length; i++) {

					tempPayload += String.fromCharCode(payload.charCodeAt(i) + 1)
					tempArray.push(payload.charCodeAt(i) + 1)

				}

				payload = tempPayload

				setTimeout(() => {

					var call = new lights.app.particle.callFunction({ deviceId: this.id, name: 'lights', argument: payload, auth: lights.app.particle.auth.accessToken})

					call.then(function(data) {

						console.log('Function called succesfully:', data)

					}, function(err) {

						console.log('An error occurred:', err)

					})

				}, 0)
				

			}

		} else {

			console.log("Device ", this.id, "not connected")
		}

	}

	turnOff(channelNumber) {

		if (channelNumber !== undefined) {
			
			this.channels[channelNumber].isOn = false

		} else {

			for (let channel of this.channels) {

				channel.isOn = false

			}

		}

	}

	resetConfig() {

		var argument = String.fromCharCode('z'.charCodeAt(0) + 1)

		console.warn("Resetting", this.id, "config")

		var call = lights.app.particle.callFunction({ deviceId: this.id, name: 'lights', argument: argument })

		call.then(function(data) {

			console.log('Function called succesfully:', data)

		}, function(err) {

			console.log('An error occurred:', err)

		})

	}

}

window.lights.Device = Device