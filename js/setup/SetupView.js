'use strict';

class SetupView extends lrs.LRSView.views.PagedView {
	
	startAction() {

		this.showView(new lrs.LRSView.views.SetupLoginView())
		
	}
	
}

window.lrs.LRSView.views.SetupView = SetupView