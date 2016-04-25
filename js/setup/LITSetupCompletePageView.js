'use strict';

class SetupCompletePageView extends lrs.LRSView.views.PageView {
	
	constructor(el, options) {

		if (!options) options = {}
		options.template = 'SetupCompletePage'

		super(el, options)

		var _this = this

		setTimeout(_this.nextAction, 2000)

		return this
		
	}

	nextAction() {

		var _this = this

		_this.owner.showView(new lrs.LRSView.views.RoomsView())

	}

}

window.lrs.LRSView.views.SetupCompletePageView = SetupCompletePageView