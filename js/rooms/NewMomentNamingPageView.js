'use strict';

class NewMomentNamingPageView extends lrs.LRSView.views.PageView {
	
	get template() {
		
		return 'NewMomentNamingPage'
		
	}

	constructor(args) {

		super(args)

		console.log(args)

		this.selectedDevices = args.selectedDevices
		this.room = args.room
		
		return this

	}

	doneAction() {

		console.log(this)

		if(this.momentName.length > 0) {

			var newMoment = new Moment(this.momentName, this.selectedDevices)
		this.room.object.moments.push(newMoment)
		lights.app.storage('rooms', lights.app.rooms)
		this.room.views.momentList.add(newMoment)
		console.log(this)
		this.owner.showView(this.owner.views.content[0])

		console.log(this)
		console.log(newMoment)

		} else {

			console.log("Please give this moment a name")

		}

	}

	closeAction() {

		this.owner.showView(this.owner.views.content[0])

	}

}

window.lrs.LRSView.views.NewMomentNamingPageView = NewMomentNamingPageView