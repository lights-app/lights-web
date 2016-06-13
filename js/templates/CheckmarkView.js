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

	check() {

		this.checked = true
		this.classList.add('checked')

	}

	uncheck() {

		this.checked = false
		this.classList.remove('checked')

	}

}

lrs.View.register(CheckmarkView)