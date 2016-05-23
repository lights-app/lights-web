'use strict';

class SetupCompletePageView extends lrs.LRSView.views.PageView {
	
	get template() { return 'SetupCompletePage' }
	
	constructor(args) {

		super(args)

		var self = this
		
		setTimeout( function() {
			self.owner.owner.views.rooms.showView(new lrs.LRSView.views.RoomsOverviewView())
			self.owner.owner.views.setup.hide()
		}, 2000)

		return this
		
	}

	nextAction(view, el, e) {

		console.log(this)

		this.owner.owner.views.rooms.showView(new lrs.LRSView.views.RoomsOverviewView())
		this.owner.showView(new lrs.LRSView.views.RoomsView())
		this.owner.owner.views.setup.hide()

	}

}

window.lrs.LRSView.views.SetupCompletePageView = SetupCompletePageView