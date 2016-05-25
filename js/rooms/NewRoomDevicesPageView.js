'use strict';

class NewRoomDevicesPageView extends lrs.views.Page {
	
	get template() {
		
		return 'NewRoomDevicesPage'
		
	}

	constructor(el, options) {

		super(el, options)

		console.log(this)

		this.views.lightsDeviceList.reset(lights.app.devices)
		
		return this

	}

	nextAction(view, el, e) {

		var selectedDevices = []

		for (let deviceView of this.views.lightsDeviceList.views.content) {

			if (deviceView.selected) {

				selectedDevices.push(deviceView.object)

			}

		}

		console.log(selectedDevices)

		if (selectedDevices.length > 0) {

			this.owner.showView(new lrs.views.NewRoomNamingPage({selectedDevices}))

		} else {

			console.log("No devices selected")

		}

	}

}

lrs.View.register(NewRoomDevicesPageView)