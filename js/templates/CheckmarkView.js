class CheckmarkView extends lrs.LRSView {
	
	get template() { return 'Checkmark' }

	constructor(args) {

		super(args)

		if (this.el.dataset.checked == "true") {

			this.check()

		}
		
		return this

	}

	toggleAction() {

		this.checked = !this.checked

		this.classList.toggle('checked', this.checked)

		var event = new CustomEvent('change', {
			detail: {
				checked: this.checked
			}
		})

		this.el.dispatchEvent(event)

	}

	check() {

		this.checked = true
		this.classList.add('checked')

		var event = new CustomEvent('change', {
			detail: {
				checked: this.checked
			}
		})

		this.el.dispatchEvent(event)

	}

	uncheck() {

		this.checked = false
		this.classList.remove('checked')

		var event = new CustomEvent('change', {
			detail: {
				checked: this.checked
			}
		})

		this.el.dispatchEvent(event)

	}

}

lrs.View.register(CheckmarkView)