'use strict';

class CheckmarkView extends lrs.LRSView {
	
	get template() { return 'Checkmark' }

	constructor(args) {

		super(args)

		console.log(this.el.dataset)

		if (this.el.dataset.checked == "true") {

			this.toggleAction()

		}
		
		return this

	}

	toggleAction() {

		var self = this

		this.checked = !this.checked

		console.log(this)

		this.classList.toggle('checked', this.checked)

	}

}

window.lrs.LRSView.views.CheckmarkView = CheckmarkView