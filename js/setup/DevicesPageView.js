'use strict';

class DevicesPageView extends lrs.views.Page {
	
	get template() { return 'DevicesPage' }
	
	constructor(args) {
		
		super(args)

		var self = this

		var lightsDevices = []

		this.views.lightsDeviceList

		lights.app.particle.listDevices().then( function(response) {

			for (let device of response.body) {
				
				lightsDevices.push(lights.Device.fromParticleDevice(device))

			}

			self.views.lightsDeviceList.reset(lightsDevices)

		}).catch( function(err) {

			console.error(err.stack)

		})

		return this

	}

	nextAction(view, el, e) {
		console.log(view, el, e)

		// Clear the device list to prevent duplicate devices when user navigates back and forth
		lights.app.devices = []
		
		var containsNonLightsDevices = false

		for (let deviceView of this.views.lightsDeviceList.views.content) {

			if (deviceView.selected) {

				if (!deviceView.object.isLightsDevice) {

					containsNonLightsDevices = true

					deviceView.object.reprogram = true

				}

				lights.app.devices.push(deviceView.object)
				console.log(lights.app.devices)

			}

		}

		if (lights.app.devices.length > 0) {

			lights.app.storage('devices', lights.app.devices)

			if(containsNonLightsDevices) {

				this.owner.showView(new lrs.views.DevicesReprogrammingPage())

			} else {

				this.owner.showView(new lrs.views.DevicesNamingPage())

			}

		} else {

			console.log("No devices selected")

		}

	}

}

lrs.View.register(DevicesPageView)