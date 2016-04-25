'use strict';

class DevicesNamingPageView extends lrs.LRSView.views.PageView {
	
	constructor(el, options) {
		
		if (!options) options = {}
		options.template = 'DevicesNamingPage'
		
		super(el, options)

		var _this = this

		_this.views.lightsDeviceList.reset(lit.app.devices)
		
		return this
	}

	doneAction(view, el, e) {

		var _this = this

		_this.owner.showView(new lrs.LRSView.views.SetupCompletePageView())

	}

}

window.lrs.LRSView.views.DevicesNamingPageView = DevicesNamingPageView