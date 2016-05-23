'use strict';

class DevicesNamingPageView extends lrs.LRSView.views.PageView {
	
	get template() { return 'DevicesNamingPage' }
	
	constructor(args) {
		
		super(args)

		this.views.lightsDeviceList.reset(lights.app.devices)
		
		return this
	}

	doneAction(view, el, e) {

		this.owner.showView(new lrs.LRSView.views.SetupCompletePageView())

	}

}

window.lrs.LRSView.views.DevicesNamingPageView = DevicesNamingPageView