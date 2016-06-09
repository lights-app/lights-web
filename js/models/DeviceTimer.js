'use strict';

class DeviceTimer extends lrs.LRSObject {
	
	constructor(config, channelCount) {

		super()

		this.config = config

		// Check if the timer data starts with the timer indicator and if the length is correct
		if (config.charCodeAt(0) !== 't'.charCodeAt(0) && config.length == 10 + (channelCount * 3 * 2)) {

			console.log("malformed timer data")

		}

		// The timer number
		this.timerNumber = config.charCodeAt(1)

		// Get the zero point selector. 0 = timer off, 1 = 12:00, 2 = sunrise, 3 = sunset
		this.zeroPointSelector = config.charCodeAt(2)

		if (this.zeroPointSelector === 0) {

			this.enabled = false

		} else {

			this.enabled = true
		}

		// Zero point (in seconds) from 0:00
		if (this.zeroPointSelector === 1) { this.zeroPoint = 43199 }

		// Zero point of sunrise (in seconds) from 0:00
		if (this.zeroPointSelector === 2) { this.zeroPoint = lights.app.sunriseSeconds }

		// Zero point of sunset (in seconds) from 0:00
		if (this.zeroPointSelector === 2) { this.zeroPoint = lights.app.sunsetSeconds }

		// Combine the next 3 bytes to get the zero point offset and subtract 43199 (half a day in seconds)
		this.zeroPointOffset = lights.app.combineBytes([config.charCodeAt(3), config.charCodeAt(4), config.charCodeAt(5)]) - 43199

		// Calculate the time (in seconds from 0:00) when the timer goes off
		this.secondsFromMidnight = this.zeroPoint + this.zeroPointOffset

		// Combine the next 3 bytes to get the interpolation time
		this.interpolationTime = lights.app.combineBytes([config.charCodeAt(6), config.charCodeAt(7), config.charCodeAt(8)])

		// Get timer mode. 0 = turns off the lights, 1 = turns on the lights with the last stored color values, 2 = turns on lights with color values stored in timer
		this.mode = config.charCodeAt(9)

		// Create an array to hold the channel color values
		this.channels = []

		// Get the timer color values
		for (var i = 0; i < channelCount; i++) {

			var rgb = []

			for (var j = 0; j < 3; j++) {

				// Calculate the position in the config string
				var pos = (i * 3 * 2) + (j * 2) + 10
				// console.log(pos)

				var val = lights.app.combineBytes([config.charCodeAt(pos), config.charCodeAt(pos + 1)])
				rgb.push(val)

			}

			this.channels.push(new lights.Color(rgb, 'rgb14'))

		}

		this.hours = this.getHours()
		this.minutes = this.getMinutes()
		this.seconds = this.getSeconds()
		
	}

	getHours() {

		return Math.floor(this.secondsFromMidnight / 3600)
		
	}

	getMinutes() {

		return Math.floor((this.secondsFromMidnight - (this.getHours() *3600)) / 60)

	}

	getSeconds() {

		return this.secondsFromMidnight - ((this.getHours() * 3600) + (this.getMinutes() * 60))

	}

}

window.lights.DeviceTimer = DeviceTimer