class DeviceReprogrammingListItemView extends lrs.views.ListItem {

	get template() { return 'DeviceReprogrammingListItem'}

	get object() {

		return this._object

	}

	set object(object) {

		this._object = object

		console.log(this)

		this.name = this.object.roomName || this.object.name

		if (this.object.connected) {

			this.classList.add('connected')

		}

		var self = this

		this.flashSuccessful = false

		document.addEventListener('flashSuccessful', function(e){

			return self.flashSuccessfulHandler(e)

		})

		document.addEventListener('deviceCameOnline', function(e){

			return self.deviceCameOnlineHandler(e)

		})

	}

	flashSuccessfulHandler(e) {

		if (e.detail.id === this.object.id) {

			this.el.classList.add('lights-device')
			this.el.classList.add('connecting')
			this.flashSuccessful = true

		}

	}

	deviceCameOnlineHandler(e) {

		if (e.detail.id === this.object.id) {

			console.log(e, this)

			this.el.classList.add('connected')
			this.el.classList.remove('connecting')
			this.el.classList.remove('reprogramming')

			if (this.flashSuccessful) {

				this.views.checkmark.check()

			}

			// If the device came online but the flash was not successful, notify user that we're going to try again
			if (this.object.reprogram && !this.object.reprogrammed) {

				this.classList.add('flash-failed')

			}

		}

	}

}

lrs.View.register(DeviceReprogrammingListItemView)