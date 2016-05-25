'use strict';

class NewRoomNamingPageView extends lrs.views.Page {
	
	get template() {
		
		return 'NewRoomNamingPage'
		
	}

	constructor(args) {

		super(args)

		console.log(args)

		this.devices = args.selectedDevices

		this.views.roomIconList.reset(lights.app.roomIconList)
		
		return this

	}

	nextAction(view, el, e) {

		var newRoom

		for (let icon of this.views.roomIconList.views.content) {

			if (icon.selected) {

				newRoom = new Room(icon.name, icon.icon, this.devices)

			}

		}

		console.log(view)
		console.log(newRoom)

		this.owner.showView(new lrs.views.NewRoomCompletionPage({newRoom}))

	}

	closeAction() {

		this.owner.showView(this.owner.views.content[0])
		
	}

}

lrs.View.register(NewRoomNamingPageView)