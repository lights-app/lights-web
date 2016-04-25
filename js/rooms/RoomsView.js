'use strict';

class RoomsView extends lrs.LRSView.views.PageView {

	constructor(el, options) {
		
		if (!options) options = {}
		options.template = 'Rooms'
		
		super(el, options)

		var _this = this

		return this
		
	}

}

window.lrs.LRSView.views.RoomsView = RoomsView