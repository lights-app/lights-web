'use strict';

class RoomsOverviewView extends lrs.LRSView.views.PageView {
	
	get template() {
		
		return 'RoomsOverview'
		
	}

	constructor(el, options) {
	
		super(el, options)
		
		this.views.roomList.reset(lights.app.rooms)
		
		return this
	
	}

	newRoomAction(view, el, e) {

		this.owner.showView(new lrs.LRSView.views.NewRoomDevicesPageView())

	}

}

window.lrs.LRSView.views.RoomsOverviewView = RoomsOverviewView