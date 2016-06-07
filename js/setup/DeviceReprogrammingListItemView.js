'use strict';

class DeviceReprogrammingListItemView extends lrs.views.ListItem {

	get template() { return 'DeviceReprogrammingListItem'}

	get object() {

		return this._object

	}

	set object(object) {

		this._object = object

		console.log(this)

		this.name = this.object.roomName || this.object.name

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
			this.flashSuccessful = true

		}

	}

	deviceCameOnlineHandler(e) {

		console.log(e)

		if (e.detail.id === this.object.id) {

			this.el.classList.add('connected')

			if (this.flashSuccessful) {

				this.views.checkmark.check()

			}

		}

	}

}

lrs.View.register(DeviceReprogrammingListItemView)