'use strict';

class SetupView extends lrs.LRSView.views.PagedView {

	constructor(el, options) {
		
		super(el, options)

		if (lights.app.particle.isLoggedIn) {
			
			// Note: Temporary; this check should happen at the app level not at the setup level.
			var self = this
			setTimeout( function() {
				self.owner.views.rooms.showView(new lrs.LRSView.views.RoomsOverviewView())
			}, 1)

		}

		return this
	}

	
	startAction() {
		
		this.showView(new lrs.LRSView.views.SetupLoginView())
		
	}
	
}

window.lrs.LRSView.views.SetupView = SetupView