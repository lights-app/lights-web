class MomentListView extends lrs.views.LRSListView {
	
	get template() {
		
		return 'MomentList'
		
	}

	constructor(el, options) {
	
		super(el, options)

		var self = this

		document.addEventListener('deviceConfigChanged', function(e){

			return self.deviceConfigChangedHandler(e)

		})
		
		return this
	
	}

	deselectAll() {

		for (let moment of this.content) {

			console.log(moment)

			moment.view.classList.remove('selected')

			moment.view.el.style["transform"] = "" 

		}
		
	}

	deviceConfigChangedHandler(e) {

		// console.log(this)

		var anyMomentActive = false

		for (let moment of this.views.content) {

			var momentIsActive = true

			// console.log(moment)

			for (let device of moment.object.devices) {

				// console.log(device)

				for (let i = 0; i < device.channelCount; i++) {

					if (device.channels[i].hex !== lights.app.devices.recordsById[device.id].channels[i].hex) {

						console.log('moment', moment.name, 'not active on device', device.id, device.channels[i].hex, lights.app.devices.recordsById[device.id].channels[i].hex)
						momentIsActive = false

						// moment.deselect()

					} else {

						console.log('moment', moment.name, 'active on device', device.id, device.channels[i].hex, lights.app.devices.recordsById[device.id].channels[i].hex)

					}

				}

			}

			if (momentIsActive) {

				console.log(moment.name, 'is active, selecting it')

				anyMomentActive = true

				moment.select()

			}

		}

		if (!anyMomentActive) {

			console.log('No moment is active, deselecting all')

			this.deselectAll()
			
		}

	}

}

lrs.View.register(MomentListView)