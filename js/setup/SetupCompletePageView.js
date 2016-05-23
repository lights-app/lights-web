'use strict';

class SetupCompletePageView extends lrs.LRSView.views.PageView {
	
	get template() { return 'SetupCompletePage' }
	
	constructor(args) {

		var self = this
		setTimeout( function() {
			self.owner.owner.views.rooms.showView(new lrs.LRSView.views.RoomsOverviewView())
		}, 2000)

		super(args)

		setTimeout(this.nextAction, 2000)

		return this
		
	}

	nextAction(view, el, e) {

		console.log(this)

		this.owner.owner.views.rooms.showView(new lrs.LRSView.views.RoomsOverviewView())
		this.owner.showView(new lrs.LRSView.views.RoomsView())

	}

}

window.lrs.LRSView.views.SetupCompletePageView = SetupCompletePageView