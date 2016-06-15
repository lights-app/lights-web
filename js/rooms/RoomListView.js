'use strict';

class RoomListView extends lrs.views.LRSListView {
	
	get template() {
		
		return 'RoomList'
		
	}

	constructor(el, options) {
	
		super(el, options)

		console.log(this)		
		
		return this
	
	}

	openColorWheelAction(view, el, e) {

		var id = view.object.devices[0].id

		console.log(this.owner.owner)

		if(!this.owner.owner.views.colorWheel) {

			var colorWheel = new lrs.views.ColorWheel({room: view.object, rgb: lights.app.devices[id].channels[0].rgb })
			lights.app.views.rooms.views.content[0].classList.add('hide')
			colorWheel.appendTo(this.owner.owner, 'colorWheel')
			console.log(colorWheel)
			// this.owner.owner.owner.showView()

		}

	}

}

lrs.View.register(RoomListView)