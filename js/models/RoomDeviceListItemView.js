class RoomDeviceListItemView extends lrs.views.ListItem {

	get template() { return 'RoomDeviceListItem'}

	get object() {

		return this._object

	}

	set object(object) {

		this._object = object

		this.name = this.object.name
		this.roomName = this.object.roomName

		if (this.el.dataset.checked == "true") {

			this.check()

		}

	}

	toggleAction() {

		this.views.checkmark.toggleAction()

		this.selected = !this.selected

		this.classList.toggle('selected', this.selected)

	}

	check() {

		this.views.checkmark.check()

		this.selected = true

		this.classList.add('selected')

	}

	uncheck() {

		this.views.checkmark.uncheck()

		this.selected = false

		this.classList.remove('selected')

	}

}

lrs.View.register(RoomDeviceListItemView)