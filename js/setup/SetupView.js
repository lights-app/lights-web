'use strict';

class SetupView extends lrs.LRSView.views.PagedView {

	constructor(el, options) {
		
		super(el, options)

		return this
	}

	
	startAction() {

		this.showView(new lrs.LRSView.views.SetupLoginView())
		
	}
	
}

window.lrs.LRSView.views.SetupView = SetupView