class DialogBoxPageView extends lrs.views.Page {
	
	get template() {
		
		return 'DialogBox'
		
	}

	constructor(el, options) {
	
		super(el, options)
		
		return this
	
	}

}

lrs.View.register(DialogBoxPageView)