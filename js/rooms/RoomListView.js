'use strict';

class RoomListView extends lrs.views.LRSListView {
	
	get template() {
		
		return 'RoomList'
		
	}

	constructor(el, options) {
	
		super(el, options)
		
		return this
	
	}

	openColorWheelAction(view, el, e) {

		var id = view.object.devices[0].id

		var colorWheel = new lrs.views.ColorWheel({room: view.object, rgb: lights.app.devices.recordsById[id].channels[0].rgb})
		// lights.app.views.rooms.views.content[0].classList.add('hide')
		// colorWheel.appendTo(this.owner.owner, 'colorWheel')
		this.owner.owner.showView(colorWheel, 'colorWheel')
		// this.owner.owner.owner.showView()

	}

}

lrs.View.register(RoomListView)