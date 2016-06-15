class CloseBtnView extends lrs.LRSView {
	
	get template() { return 'CloseBtn' }

	constructor(args) {

		super(args)

		return this

	}

}

lrs.View.register(CloseBtnView)