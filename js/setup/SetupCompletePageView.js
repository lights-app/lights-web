'use strict';

class SetupCompletePageView extends lrs.LRSView.views.PageView {
	
	get template() { return 'SetupCompletePage' }
	
	constructor(args) {

		super(args)

		setTimeout(this.nextAction, 2000)

		return this
		
	}

	nextAction() {

		this.owner.showView(new lrs.LRSView.views.RoomsView())

	}

}

window.lrs.LRSView.views.SetupCompletePageView = SetupCompletePageView