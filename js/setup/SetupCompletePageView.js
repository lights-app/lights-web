'use strict';

class SetupCompletePageView extends lrs.LRSView.views.PageView {
	
	constructor(el, options) {

		if (!options) options = {}
		options.template = 'SetupCompletePage'

		super(el, options)

		var self = this
		setTimeout( function() {
			self.owner.owner.views.rooms.showView(new lrs.LRSView.views.RoomsOverviewView())
		}, 2000)

		return this
		
	}

	nextAction(view, el, e) {

		console.log(this)

		this.owner.owner.views.rooms.showView(new lrs.LRSView.views.RoomsOverviewView())

	}

}

window.lrs.LRSView.views.SetupCompletePageView = SetupCompletePageView