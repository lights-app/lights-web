'use strict';

class DevicesNamingPageView extends lrs.LRSView.views.PageView {
	
	constructor(el, options) {
		
		if (!options) options = {}
		options.template = 'DevicesNamingPage'
		
		super(el, options)

		this.views.lightsDeviceList.reset(lights.app.devices)
		
		return this
	}

	doneAction(view, el, e) {

		console.log(this)
		this.owner.showView(new lrs.LRSView.views.SetupCompletePageView())

	}

}

window.lrs.LRSView.views.DevicesNamingPageView = DevicesNamingPageView