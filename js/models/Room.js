'use strict';

class Room extends lrs.LRSObject {
	
	constructor(name, icon, devices) {

		super()

		this.name = name

		this.icon = icon

		this.devices = devices

		this.moments = []

		this.channelCount = this.getChannelCount()
		
	}

	getChannelCount() {

		var channelCount = 0

		for (let device of this.devices) {

			channelCount += lights.app.devices[device.id].channelCount

		}

		console.log(channelCount)

		return channelCount

	}

}

window.lights.Room = Room