class DevicesReprogrammingPageView extends lrs.views.Page {
	
	get template() { return 'DevicesReprogrammingPage' }

	constructor(args) {

		super(args)

		var self = this

		console.log(args)

		this.url = "/static/bin/lights-v" + lights.app.requiresParticleVersion[0] + '.' + lights.app.requiresParticleVersion[1] + '.' + lights.app.requiresParticleVersion[2] + '.bin'

		this.devices = args.devices

		this.views.lightsDeviceList.reset(this.devices)

		document.addEventListener('flashSuccessful', function(e){

			return self.flashSuccessfulHandler(e)

		})

		document.addEventListener('flashFailed', function(e){

			return self.flashFailedHandler(e)

		})

		document.addEventListener('deviceCameOnline', function(e){

			return self.deviceCameOnlineHandler(e)

		})

		return this

	}

	reprogramAction() {

		var self = this

		for (let device of this.views.lightsDeviceList.content) {

			console.log(device)

			device.view.views.checkmark.uncheck()

			self.flashFirmware(device.object, self.url, device)

		}

	}

	flashFirmware(device, url, deviceView) {

		var self = this

		if(device.connected) {

			device.connectedAfterFlash = false

			deviceView.view.classList.add('reprogramming')
			deviceView.view.classList.remove('connected')

			console.log("Flashing Lights firmware to", device)

			// Create a new XMLHttpRequest.
			// Just giving a url to the binary file does not work when flashing firmware. We first have to GET the file
			var xhr = new XMLHttpRequest()

			// Set the event handler for when the request is completed
			xhr.onload = function(e) {

				// Create a new file from the response
				var file = new File([xhr.response], 'lights.bin')

				// Flash the binary firmware to the specified device
				var flash = lights.app.particle.flashDevice({deviceId: device.id, files: { file1: file} })

				flash.then (

					function(data) {
						console.log('Device flashing started successfully', data)
					}, function(err) {
						console.log('An error occured while flashing the device, trying again', err)
						console.log(device, self.url)

						// setTimeout(function(){

						// 	self.flashFirmware(device, self.url)

						// }, 5000)
						
					}

					)

			}

			// Get the file
			xhr.open("GET", url)
			// Specify the filetype
			xhr.responseType = "arraybuffer"
			// Make the request
			xhr.send()

		} else {

			console.warn(device.id, "not connected")
		}

	}

	flashSuccessfulHandler(e) {

		var self = this

		console.log(e)

		var oldName = lights.app.devices.recordsById[e.detail.id].name
		var newName = String("Lights__" + oldName)
		lights.app.devices.recordsById[e.detail.id].reprogram = false
		lights.app.devices.recordsById[e.detail.id].reprogrammed = true

		// Check if we should rename the device
		if(lights.app.devices.recordsById[e.detail.id].name.split('__')[0] !== 'Lights') {

			var rename = lights.app.particle.renameDevice({ deviceId: e.detail.id, name: newName })

			rename.then(

				function(data) {

					console.log('Device renamed successfully to ' + newName, data)

				}, function(err) {

					console.log('An error occured while renaming device to' + newName, err)

				}

				)

		}

	}

	flashFailedHandler(e) {

		console.log("Flashing", e.detail.id, "failed, retrying...")
		lights.app.devices.recordsById[e.detail.id].reprogram = true
		lights.app.devices.recordsById[e.detail.id].reprogrammed = false

		// this.flashFirmware(lights.app.devices[e.detail.id], this.url)

	}

	deviceCameOnlineHandler(e) {

		var allDevicesReprogrammed = true
		var allDevicesOnline = true

		for (let deviceView of this.views.lightsDeviceList.content) {

			// Check if all devices have been reprogrammed
			if (deviceView.object.reprogram && !deviceView.object.reprogrammed) {

				allDevicesReprogrammed = false

				// If it has not been reprogrammed and the device id matches that of the deviceCameOnline event details
				// re-flash the firmware
				if (e.detail.id === deviceView.object.id) {

					console.log(e.detail.id, "came online, but was not reprogrammed correctly, re-flashing firmware")

					this.flashFirmware(deviceView.object, this.url, deviceView)

				}

			} else {

				if (deviceView.object.id === e.detail.id) {

					deviceView.object.connectedAfterFlash = true

					// Immediately reset the config of the device
					deviceView.object.resetConfig()

				}

				if (!deviceView.object.connectedAfterFlash) {

					allDevicesOnline = false

				}

			}

		}

		if (allDevicesReprogrammed && allDevicesOnline) {

			console.log("All devices have been reprogrammed")

			var self = this

			setTimeout(function() {

				self.owner.showView(new lrs.views.DevicesNamingPage({devices: self.devices}))

			}, 3000)

		}

	}

}

lrs.View.register(DevicesReprogrammingPageView)