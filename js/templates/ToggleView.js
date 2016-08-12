class ToggleView extends lrs.LRSView {
	
	get template() { return 'Toggle' }

	constructor(args) {

		super(args)
		
		return this

	}

	toggleAction() {

		var self = this

		this.checked = !this.checked

		console.log(this)

		this.classList.toggle('checked', this.checked)

		var event = new CustomEvent('change', {
			detail: {
				checked: this.checked
			}
		})

		this.el.dispatchEvent(event)

	}

}

lrs.View.register(ToggleView)