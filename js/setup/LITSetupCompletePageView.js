'use strict';

class LITSetupCompletePageView extends lrs.LRSView.views.LITPageView {
	
	constructor(el, options) {

		if (!options) options = {}
		options.template = 'LITSetupCompletePage'

		super(el, options)
		
	}

}

window.lrs.LRSView.views.LITSetupCompletePageView = LITSetupCompletePageView