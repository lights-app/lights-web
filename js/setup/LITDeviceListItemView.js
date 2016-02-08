'use strict';

class LITDeviceListItemView extends lrs.LRSView.views.LRSListItemView {
	
	constructor(el, options) {

		if (!options) options = {}
		options.template = 'LITDeviceListItem'
		
		super(el, options)
		
	}

	get object() {

		return this._object

	}

	set object(object) {

		this._object = object

		this.name = this.object.roomName || this.object.name

	}

	toggleAction() {

		this.selected = !this.selected

		this.classList.toggle('selected', this.selected)

	}

}

window.lrs.LRSView.views.LITDeviceListItemView = LITDeviceListItemView