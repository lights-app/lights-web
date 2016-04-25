'use strict';

class DeviceListItemView extends lrs.LRSView.views.LRSListItemView {
	
	constructor(el, options) {

		if (!options) options = {}
		options.template = 'DeviceListItem'

		super(el, options)
		
	}

	get object() {

		return this._object

	}

	set object(object) {

		this._object = object

		this.name = this.object.roomName || this.object.name

		if (this.object.connected) {

			this.classList.add('connected')

		}

		if (this.object.isLightsDevice) {

			this.classList.add('lights-device')

		}

	}

	toggleAction() {

		this.selected = !this.selected

		this.classList.toggle('selected', this.selected)

	}

}

window.lrs.LRSView.views.DeviceListItemView = DeviceListItemView