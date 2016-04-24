'use strict';

class LITSetupView extends lrs.LRSView.views.LITPagedView {

	constructor(el, options) {
		
		if (!options) options = {}
		options.template = 'LITSetup'
		
		super(el, options)

		var _this = this

		if (window.localStorage.accessToken.length > 20) {

			_this.showView(new lrs.LRSView.views.LITRoomsView())

		}

		return this
	}

	
	startAction() {
		
		this.showView(new lrs.LRSView.views.LITSetupLoginView())
		
	}
	
}

window.lrs.LRSView.views.LITSetupView = LITSetupView