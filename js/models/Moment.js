class Moment extends lrs.LRSObject {
	
	constructor(name, devices) {

		super()

		this.name = name

		this.devices = []

		for (let device of devices) {

			var newDevice = {}
			newDevice.id = device.id

			newDevice.channels = []
			newDevice.channelCount = device.channelCount

			for (let channel of device.channels) {

				var color = new lights.Color(channel.rgb, 'rgb')
				newDevice.channels.push(color)

			}

			this.devices.push(newDevice)

		}
		
	}

}

window.lights.Moment = Moment