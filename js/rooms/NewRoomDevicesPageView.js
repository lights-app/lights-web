'use strict';

class NewRoomDevicesPageView extends lrs.LRSView.views.PageView {
	
	get template() {
		
		return 'NewRoomDevicesPage'
		
	}

	constructor(el, options) {

		super(el, options)

		console.log(this)

		// Populate the lightsDevicesList with all devices coupled to the user's account
		this.views.lightsDeviceList.reset(lights.app.devices)
		
		return this

	}

	nextAction(view, el, e) {

		var selectedDevices = []

		for (let deviceView of this.views.lightsDeviceList.views.content) {

			if (deviceView.selected) {

				// If the device has been selected by the user, put it in the temporary "selectedDevices" array
				selectedDevices.push(deviceView.object)

			}

		}

		console.log(selectedDevices)

		// Check if the user has selected at least one device
		if (selectedDevices.length > 0) {

			// If so, navigate to the NewRoomNamingPage and send the selectedDevices array as an argument
			this.owner.showView(new lrs.LRSView.views.NewRoomNamingPageView({selectedDevices}))

		} else {

			// Warn the user, visual feedback needed
			console.log("No devices selected")

		}

	}

	closeAction() {

		this.owner.showView(this.owner.views.content[0])
		
	}

}

window.lrs.LRSView.views.NewRoomDevicesPageView = NewRoomDevicesPageView