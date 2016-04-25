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
		
	}

}

window.lights.Device = Device