'use strict';

class AddBtn extends lrs.LRSView {
	
	get template() { return 'AddBtn' }

	constructor(args) {

		super(args)

		return this

	}

}

window.lrs.LRSView.views.AddBtn = AddBtn