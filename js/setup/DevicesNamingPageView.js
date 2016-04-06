'use strict';

class DevicesNamingPageView extends lrs.LRSView.views.PageView {
	
	constructor(el, options) {
		
		if (!options) options = {}
		options.template = 'DevicesNamingPage'
		
		super(el, options)
		
	}

}

window.lrs.LRSView.views.DevicesNamingPageView = DevicesNamingPageView