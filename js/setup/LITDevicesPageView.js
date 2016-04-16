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

	}

	nextAction(view, el, e) {

		var deviceViews = this.views.lightsDeviceList.views.content.concat(this.views.otherDeviceList.views.content)

		for (let deviceView of deviceViews) {

			if (deviceView.selected) {

				lit.app.devices.push(deviceView.object)

			}

		}

		console.log(lit.app.devices)

	}

}

window.lrs.LRSView.views.LITDevicesPageView = LITDevicesPageView