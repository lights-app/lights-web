'use strict';

class NewRoomCompletionPageView extends lrs.views.Page {
	
	get template() {
		
		return 'NewRoomCompletionPage'
		
	}

	constructor(args) {

		super(args)

		console.log(args)
		this.room = args.newRoom
		console.log(this)
		// this.room.name = room.name || "error"
		
		return this

	}

	skipAction(view, el, e) {

		lights.app.rooms.push(view.room)
		lights.app.storage('rooms', lights.app.rooms)
		console.log(view)

		view.owner.views.content[0].views.roomList.add(view.room)
		view.owner.showView(view.owner.views.content[0])

	}

}

lrs.View.register(NewRoomCompletionPageView)