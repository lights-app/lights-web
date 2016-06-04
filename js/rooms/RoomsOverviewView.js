'use strict';

class RoomsOverviewView extends lrs.views.Page {
	
	get template() {
		
		return 'RoomsOverview'
		
	}

	constructor(el, options) {
	
		super(el, options)

		console.log(this)
		
		this.views.roomList.reset(lights.app.rooms)
		
		return this
	
	}

	newRoomAction(view, el, e) {

		this.owner.showView(new lrs.views.NewRoomDevicesPage())

	}

}

lrs.View.register(RoomsOverviewView)