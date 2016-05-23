'use strict';

class RoomsOverviewView extends lrs.LRSView.views.PageView {
	
	get template() { return 'RoomsOverview' }

	constructor(args) {
	
		super(args)
		
		var rooms = [
			{
				name: 'Room 1'
			},
			{
				name: 'Room 2'
			},
			{
				name: 'Room 3'
			}
		]
		
		this.views.roomList.reset(rooms)
		
		return this
		
	
	}

}

window.lrs.LRSView.views.RoomsOverviewView = RoomsOverviewView