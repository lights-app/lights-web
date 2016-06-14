class SetupCompletePageView extends lrs.views.Page {
	
	get template() { return 'SetupCompletePage' }
	
	constructor(args) {

		super(args)

		var self = this

		for (let device of lights.app.devices.records) {

			device.getConfig()
			
		}
		
		// setTimeout( function() {
		// 	self.owner.owner.views.rooms.showView(new lrs.views.RoomsOverview())
		// 	self.owner.owner.views.setup.hide()
		// }, 2000)

		return this
		
	}

	nextAction(view, el, e) {

		console.log(this)

		this.owner.owner.views.rooms.show()
		// this.owner.showView(new lrs.views.Rooms())
		this.owner.owner.views.setup.hide()

	}

}

lrs.View.register(SetupCompletePageView)