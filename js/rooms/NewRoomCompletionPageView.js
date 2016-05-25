'use strict';

class NewRoomCompletionPageView extends lrs.LRSView.views.PageView {
	
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

		// User does not want to create a new moment directly. Add the new room to the rooms stored in app
		lights.app.rooms.push(view.room)

		// Write to storage
		lights.app.storage('rooms', lights.app.rooms)
		console.log(view)

		// Add the new room to the view
		view.owner.views.content[0].views.roomList.add(view.room)

		// Return to rooms overview
		view.owner.showView(view.owner.views.content[0])

	}

	newMomentAction() {

		console.log(this)

		// Add the new room to the rooms stored in app
		lights.app.rooms.push(this.room)

		// Write to storage
		lights.app.storage('rooms', lights.app.rooms)

		// Add the new room to the view
		this.owner.views.content[0].views.roomList.add(this.room)

		// Get the RoomListItemView object from the roomList (needed for the creation of a new moment)
		var roomView = this.owner.views.content[0].views.roomList.content[this.owner.views.content[0].views.roomList.content.length - 1].view
		console.log(roomView)

		// Show the NewMomentPage
		this.owner.showView(new lrs.LRSView.views.NewMomentPageView({room: roomView}))

	}

	closeAction() {

		this.owner.showView(this.owner.views.content[0])
		
	}

}

window.lrs.LRSView.views.NewRoomCompletionPageView = NewRoomCompletionPageView