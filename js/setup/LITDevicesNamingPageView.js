'use strict';

class LITDevicesNamingPageView extends lrs.LRSView.views.LITPageView {
	
	constructor(el, options) {
		
		if (!options) options = {}
		options.template = 'LITDevicesNamingPage'
		
		super(el, options)

		var _this = this

		_this.views.lightsDeviceList.reset(lit.app.devices)
		
		return this
	}

	doneAction(view, el, e) {

		var _this = this

		_this.owner.showView(new lrs.LRSView.views.LITSetupCompletePageView())

	}

}

window.lrs.LRSView.views.LITDevicesNamingPageView = LITDevicesNamingPageView