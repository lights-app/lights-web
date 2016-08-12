class DevicesSettingPageView extends lrs.views.Page {
	
	get template() {
		
		return 'DevicesSettingPage'
		
	}

	constructor(el, options) {

		console.log(el, options)
	
		super(el, options)

		console.log(this)

		this.views.devicesSettingList.reset(lights.app.devices.records)
		
		return this
	
	}

	addDeviceAction(view, el, e) {

		console.log('settings')

		this.owner.showView(new lrs.views.AddDeviceSettingPage())

	}

}

lrs.View.register(DevicesSettingPageView)