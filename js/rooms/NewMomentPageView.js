class NewMomentPageView extends lrs.views.Page {
	
	get template() {
		
		return 'NewMomentPage'
		
	}

	constructor(args) {

		super(args)

		var self = this

		console.log(this)
		console.log(args)

		console.log(args.room.object.devices)
		
		this.room = args.room

		this.views.momentDeviceList.reset(args.room.object.devices)

		for (let deviceView of this.views.momentDeviceList.content) {

			console.log(deviceView)

			if (!lights.app.devices.recordsById[deviceView.object.id].connected) {

				deviceView.view.classList.add('disconnected')

			}
		}

		for (let deviceObject of this.views.momentDeviceList.content) {

			deviceObject.view.views.toggle.el.addEventListener('change', function(e){

				return self.toggleChanged(e, deviceObject.view)

			})

		}
		
		return this

	}

	nextAction() {

		var selectedDevices = []

		for (let deviceView of this.views.momentDeviceList.views.content) {

			console.log(deviceView)

			if (deviceView.views.toggle.checked) {

				selectedDevices.push(lights.app.devices.recordsById[deviceView.object.id])

			}

		}

		console.log(selectedDevices)

		if (selectedDevices.length > 0) {

			console.log(this)

			this.owner.showView(new lrs.LRSView.views.NewMomentNamingPageView({selectedDevices: selectedDevices, room :this.room}))

		} else {

			console.log("No devices selected")

		}

	}

	toggleChanged(e, view) {

		if (e.detail.checked) {

			view.classList.add('selected')

		} else {

			view.classList.remove('selected')

		}

	}

	openColorWheelAction(view, el, e) {

		console.log(lights.app.devices.recordsById[view.object.id])

		var device = lights.app.devices.recordsById[view.object.id]

		// Create a temporary Room object to use the colorWHeel
		var tempRoom = new Room(view.object.roomName , null, [device])

		console.log(this)

		var colorWheel = new lrs.views.ColorWheel({room: tempRoom, rgb: device.channels[0].rgb})
		// lights.app.views.rooms.views.content[0].classList.add('hide')
		// colorWheel.appendTo(this.owner.owner, 'colorWheel')
		this.owner.showView(colorWheel, 'colorWheel')
		// this.owner.owner.owner.showView()

	}

	closeAction() {

		this.owner.showView(this.owner.views.content[0])
		
	}

}

window.lrs.LRSView.views.NewMomentPageView = NewMomentPageView