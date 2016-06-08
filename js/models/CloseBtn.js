'use strict';

class CloseBtn extends lrs.LRSView {
	
	get template() { return 'CloseBtn' }

	constructor(args) {

		super(args)

		return this

	}

}

window.lrs.LRSView.views.CloseBtn = CloseBtn