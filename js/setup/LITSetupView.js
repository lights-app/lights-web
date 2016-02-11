'use strict';

class LITSetupView extends lrs.LRSView.views.LITPagedView {
	
	startAction() {
		
		this.showView(new lrs.LRSView.views.LITSetupLoginView())
		
	}
	
}

window.lrs.LRSView.views.LITSetupView = LITSetupView