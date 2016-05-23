'use strict';

class DevicesPageView extends lrs.LRSView.views.PageView {
	
	constructor(el, options) {
		
		if (!options) options = {}
		options.template = 'DevicesPage'
		
		super(el, options)

		var _this = this

		var lightsDevices = []

		this.views.lightsDeviceList

		lights.app.particle.listDevices().then( function(response) {

			for (let device of response.body) {

				let _device = lights.Device.fromParticleDevice(device)

				console.log(_device)

				lightsDevices.push(_device)

			}

			_this.views.lightsDeviceList.reset(lightsDevices)

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