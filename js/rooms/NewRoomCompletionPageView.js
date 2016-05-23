'use strict';

class NewRoomCompletionPageView extends lrs.LRSView.views.PageView {
	
	get template() {
		
		return 'NewRoomCompletionPage'
		
	}

	constructor(el, options, room) {

		super(el, options)

		this.room = room
		
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

window.lrs.LRSView.views.NewRoomCompletionPageView = NewRoomCompletionPageView