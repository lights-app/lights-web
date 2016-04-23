'use strict';

class LITDevicesReprogrammingPageView extends lrs.LRSView.views.LITPageView {
	
	constructor(el, options) {
		
		if (!options) options = {}
		options.template = 'LITDevicesReprogrammingPage'
		
		super(el, options)

	}

}

window.lrs.LRSView.views.LITDevicesReprogrammingPageView = LITDevicesReprogrammingPageView