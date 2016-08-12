class AddDeviceSettingPageView extends lrs.views.Page {
	
	get template() {
		
		return 'AddDeviceSettingPage'
		
	}

	constructor(el, options) {
	
		super(el, options)

		console.log(this)

		var nonLightsDevices =[]

		for (let device of lights.app.particleDevices) {

			if (!lights.app.devices.recordsById[device.id]) {

				nonLightsDevices.push(device)

			}

		}

		console.log(nonLightsDevices)

		this.views.lightsDeviceList.reset(nonLightsDevices)
		
		return this
	
	}

	addDeviceAction() {

		var containsNonLightsDevices = false
		var nonLightsDevices = []
		var selectedDevices = []

		for (let deviceView of this.views.lightsDeviceList.views.content) {

			if (deviceView.selected) {

				if (!deviceView.object.isLightsDevice) {

					containsNonLightsDevices = true

					deviceView.object.reprogram = true
					deviceView.object.reprogrammed = false

					nonLightsDevices.push(deviceView.object)

				}

				selectedDevices.push(deviceView.object)
				lights.app.devices.add(deviceView.object)

			}

			console.log(selectedDevices)

		}

		if (selectedDevices.length > 0) {
			
			lights.app.storage('devices', lights.app.devices)

			if(containsNonLightsDevices) {

				console.log(nonLightsDevices)

				this.owner.showView(new lrs.views.DevicesReprogrammingPage({devices: nonLightsDevices}))

			} else {

				this.owner.showView(new lrs.views.DevicesNamingPage({devices: selectedDevices}))

			}

		} else {

			console.log("No devices selected")

		}

	}

}

lrs.View.register(AddDeviceSettingPageView)