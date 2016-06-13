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

		this.views.checkmark.toggleAction()

		this.selected = !this.selected

		this.classList.toggle('selected', this.selected)

	}

}

lrs.View.register(RoomDeviceListItemView)