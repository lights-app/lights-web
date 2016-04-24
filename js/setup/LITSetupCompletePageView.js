'use strict';

class LITSetupCompletePageView extends lrs.LRSView.views.LITPageView {
	
	constructor(el, options) {

		if (!options) options = {}
		options.template = 'LITSetupCompletePage'

		super(el, options)

		var _this = this

		setTimeout(_this.nextAction, 2000)

		return this
		
	}

	nextAction() {

		var _this = this

		_this.owner.showView(new lrs.LRSView.views.LITRoomsView())

	}

}

window.lrs.LRSView.views.LITSetupCompletePageView = LITSetupCompletePageView