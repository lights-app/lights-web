'use strict';

class DeviceListItemView extends lrs.views.ListItem {
	
	get template() { return 'DeviceListItem' }

	get object() {

		return this._object

	}

	set object(object) {

		this._object = object

		var self = this

		console.log(this)

		this.name = this.object.roomName || this.object.name

		if (this.object.connected) {

			this.classList.add('connected')

		}

		if (this.object.isLightsDevice) {

			this.classList.add('lights-device')

		}

		document.addEventListener('deviceCameOnline', function(e){

			return self.deviceCameOnlineHandler(e)

		})

		document.addEventListener('deviceWentOffline', function(e){

			return self.deviceWentOfflineHandler(e)

		})

	}

	toggleAction() {

		console.log(this)

		this.selected = !this.selected

		this.classList.toggle('selected', this.selected)

		this.views.checkmark.toggleAction()


	}

	deviceCameOnlineHandler(e) {

		if (e.detail.id === this.object.id) {

			console.log(e, this)

			this.classList.add('connected')

		}

	}

	deviceWentOfflineHandler(e) {

		if (e.detail.id === this.object.id) {

			console.log(e, this)

			this.classList.remove('connected')

		}

	}

}

lrs.View.register(DeviceListItemView)