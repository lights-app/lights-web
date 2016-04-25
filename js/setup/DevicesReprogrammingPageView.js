'use strict';

class DevicesReprogrammingPageView extends lrs.LRSView.views.PageView {
	
	constructor(el, options) {
		
		if (!options) options = {}
		options.template = 'DevicesReprogrammingPage'
		
		super(el, options)

	}

}

window.lrs.LRSView.views.DevicesReprogrammingPageView = DevicesReprogrammingPageView