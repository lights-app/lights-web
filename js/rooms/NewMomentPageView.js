'use strict';

class NewMomentPageView extends lrs.LRSView.views.PageView {
	
	get template() {
		
		return 'NewMomentPage'
		
	}

	constructor(args) {

		super(args)

		console.log(this)
		console.log(args)

		console.log(args.room.object.devices)
		
		this.room = args.room

		this.views.momentDeviceList.reset(args.room.object.devices)
		
		return this

	}

	nextAction() {

		var selectedDevices = []

		for (let deviceView of this.views.momentDeviceList.views.content) {

			console.log(deviceView)

			if (deviceView.views.toggle.checked) {

				selectedDevices.push(deviceView.object)

			}

		}

		console.log(selectedDevices)

		if (selectedDevices.length > 0) {

			this.owner.showView(new lrs.LRSView.views.NewMomentNamingPageView({selectedDevices: selectedDevices, room :this.room}))

		} else {

			console.log("No devices selected")

		}

	}

	closeAction() {

		this.owner.showView(this.owner.views.content[0])
		
	}

}

window.lrs.LRSView.views.NewMomentPageView = NewMomentPageView