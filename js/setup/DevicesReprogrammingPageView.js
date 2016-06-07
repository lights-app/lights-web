'use strict';

class DevicesReprogrammingPageView extends lrs.views.Page {
	
	get template() { return 'DevicesReprogrammingPage' }

	constructor(args) {

		super(args)

		var self = this

		console.log(args)

		this.url = "/static/bin/lights.bin"

		this.views.lightsDeviceList.reset(lights.app.devicesArray)

		document.addEventListener('flashSuccessful', function(e){

			return self.flashSuccessfulHandler(e)

		})

		document.addEventListener('deviceCameOnline', function(e){

			return self.deviceCameOnlineHandler(e)

		})

		for (let device of args.devices) {

			this.flashFirmware(device, this.url)

		}

		return this

	}

	flashFirmware(device, url) {

		console.log(device, url)

		// Create a new XMLHttpRequest.
		// Just giving a url to the binary file does not work when flashing firmware. We first have to GET the file
		var xhr = new XMLHttpRequest()

		// Set the event handler for when the request is completed
		xhr.onload = function(e) {

			// Create a new file from the response
			var file = new File([xhr.response], 'lights.bin')

			// Flash the binary firmware to the specified device
			var flash = lights.app.particle.flashDevice({deviceId: device.id, files: { file1: file}, auth: lights.app.particle.auth.accessToken })

			flash.then (

				function(data) {
					console.log('Device flashing started successfully', data)
				}, function(err) {
					console.log('An error occured while flashing the device', err)
				}

				)

		}

		// Get the file
		xhr.open("GET", url)
		// Specify the filetype
		xhr.responseType = "arraybuffer"
		// Make the request
		xhr.send()

	}

	flashSuccessfulHandler(e) {

		console.log(e)

		var oldName = lights.app.devices[e.detail.id].name
		var newName = String("Lights__" + oldName)
		lights.app.devices[e.detail.id].reprogram = false
		lights.app.devices[e.detail.id].reprogrammed = true

		var rename = lights.app.particle.renameDevice({ deviceId: e.detail.id, name: newName, auth: lights.app.particle.auth.accessToken})

		rename.then(

			function(data) {

				console.log('Device renamed successfully to ' + newName, data)

			}, function(err) {

				console.log('An error occured while renaming device to' + newName, err)

			}

			)

	}

	deviceCameOnlineHandler(e) {

		var allDevicesReprogrammed = true

		for (let device of lights.app.devicesArray) {

			if (device.reprogram && !device.reprogrammed) {

				allDevicesReprogrammed = false

			}

		}

		if (allDevicesReprogrammed) {

			console.log("All devices have been reprogrammed")

			var self = this

			setTimeout(function() {

				self.owner.showView(new lrs.views.DevicesNamingPage())

			}, 3000)

		}

	}

}

lrs.View.register(DevicesReprogrammingPageView)