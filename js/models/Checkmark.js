'use strict';

class CheckmarkView extends lrs.LRSView {
	
	get template() { return 'Checkmark' }

	constructor(args) {

		super(args)

		if (this.el.dataset.checked == "true") {

			this.toggleAction()

		}
		
		return this

	}

	toggleAction() {

		this.checked = !this.checked

		this.classList.toggle('checked', this.checked)

	}

}

window.lrs.LRSView.views.CheckmarkView = CheckmarkView