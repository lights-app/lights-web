'use strict';

class RoomDeviceListItemView extends lrs.views.ListItem {

	get template() { return 'RoomDeviceListItem'}

	get object() {

		return this._object

	}

	set object(object) {

		this._object = object

		this.name = this.object.name
		this.roomName = this.object.roomName

	}

	toggleAction() {

		

	}

}

lrs.View.register(RoomDeviceListItemView)