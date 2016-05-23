'use strict';

class DevicesPageView extends lrs.LRSView.views.PageView {
	
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

		var containsNonLightsDevices = false

		for (let deviceView of this.views.lightsDeviceList.views.content) {

			if (deviceView.selected) {

				if (!deviceView.object.isLightsDevice) {

					containsNonLightsDevices = true

					deviceView.object.reprogram = true

				}

				lights.app.devices.push(deviceView.object)

			}

		}

		if (lights.app.devices.length > 0) {

			if(containsNonLightsDevices) {

				this.owner.showView(new lrs.LRSView.views.DevicesReprogrammingPageView())

			} else {

				this.owner.showView(new lrs.LRSView.views.DevicesNamingPageView())

			}

		} else {

			console.log("No devices selected")

		}

	}

}

window.lrs.LRSView.views.DevicesPageView = DevicesPageView