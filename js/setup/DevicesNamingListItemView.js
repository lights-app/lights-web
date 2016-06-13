class DeviceNamingListItemView extends lrs.views.ListItem {

	get template() { return 'DeviceNamingListItem'}

	get object() {

		return this._object

	}

	set object(object) {

		this._object = object

		this.name = this.object.roomName || this.object.name

	}

}

lrs.View.register(DeviceNamingListItemView)