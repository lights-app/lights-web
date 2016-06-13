class RoomsOverviewView extends lrs.views.Page {
	
	get template() {
		
		return 'RoomsOverview'
		
	}

	constructor(el, options) {
	
		super(el, options)

		console.log(this)

		lights.app.setRooms()

		if(lights.app.rooms.length > 0) {

			this.views.roomList.views.noRooms.remove()

		}
		
		this.views.roomList.reset(lights.app.rooms)

		this.rooms = lights.app.rooms
		
		return this
	
	}

	addAction(view, el, e) {

		this.owner.showView(new lrs.views.NewRoomDevicesPage())

	}

}

lrs.View.register(RoomsOverviewView)