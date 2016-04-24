'use strict';

class LITRoomsView extends lrs.LRSView.views.LITPageView {

	constructor(el, options) {
		
		if (!options) options = {}
		options.template = 'LITRooms'
		
		super(el, options)

		var _this = this

		return this
		
	}

}

window.lrs.LRSView.views.LITRoomsView = LITRoomsView