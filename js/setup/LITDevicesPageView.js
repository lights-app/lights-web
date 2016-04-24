'use strict';

class LITDevicesPageView extends lrs.LRSView.views.LITPageView {
	
	constructor(el, options) {
		
		if (!options) options = {}
		options.template = 'LITDevicesPage'
		
		super(el, options)

		var _this = this

		var lightsDevices = []

		this.views.lightsDeviceList

		spark.listDevices().then( function(devices) {

			for (let device of devices) {

				let _device = lit.LITDevice.fromSparkDevice(device)

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

		var _this = this

		var containsNonLightsDevices = false

		for (let deviceView of this.views.lightsDeviceList.views.content) {

			if (deviceView.selected) {

				if (!deviceView.object.isLightsDevice) {

					containsNonLightsDevices = true

					deviceView.object.reprogram = true

				}

				lit.app.devices.push(deviceView.object)

			}

		}

		if (lit.app.devices.length > 0) {

			if(containsNonLightsDevices) {

				_this.owner.showView(new lrs.LRSView.views.LITDevicesReprogrammingPageView())

			} else {

				_this.owner.showView(new lrs.LRSView.views.LITDevicesNamingPageView())

			}

		} else {

			console.log("No devices selected")

		}

	}

}

window.lrs.LRSView.views.LITDevicesPageView = LITDevicesPageView