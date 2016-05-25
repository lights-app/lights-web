'use strict';

class DevicesNamingPageView extends lrs.views.Page {
	
	get template() { return 'DevicesNamingPage' }
	
	constructor(args) {
		
		super(args)

		this.views.lightsDeviceList.reset(lights.app.devices)
		
		return this
	}

	doneAction(view, el, e) {

		console.log(this)
		
		this.owner.showView(new lrs.views.SetupCompletePage())

	}

}

lrs.View.register(DevicesNamingPageView)