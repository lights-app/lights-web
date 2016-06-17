class Room extends lrs.LRSObject {
	
	constructor(name, icon, devices, moments) {

		super()

		this.name = name

		this.icon = icon

		this.devices = devices

		this.moments = moments || []

		this.channelCount = this.getChannelCount()
		
	}

	getChannelCount() {

		var channelCount = 0

		for (let device of this.devices) {

			channelCount += device.channelCount

		}

		return channelCount

	}

}

window.lights.Room = Room