'use strict';

class LITDevicesNamingPageView extends lrs.LRSView.views.LITPageView {
	
	constructor(el, options) {
		
		if (!options) options = {}
		options.template = 'LITDevicesNamingPage'
		
		super(el, options)
		
	}

}

window.lrs.LRSView.views.LITDevicesNamingPageView = LITDevicesNamingPageView