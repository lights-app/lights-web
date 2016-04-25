'use strict';

class SetupView extends lrs.LRSView.views.PagedView {

	constructor(el, options) {
		
		if (!options) options = {}
		options.template = 'Setup'
		
		super(el, options)

		var _this = this

		if (lights.app.particle.isLoggedIn) {

			_this.showView(new lrs.LRSView.views.RoomsView())

		}

		return this
	}

	
	startAction() {
		
		this.showView(new lrs.LRSView.views.SetupLoginView())
		
	}
	
}

window.lrs.LRSView.views.SetupView = SetupView