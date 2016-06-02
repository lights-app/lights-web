'use strict';

class RoomListItemView extends lrs.View.views.LRSListItemView {

	get template() { return 'RoomListItem'}

	get object() {

		return this._object

	}

	set object(object) {

		this._object = object

		this.name = this.object.name
		this.icon = this.object.icon
		console.log(this)
		this.views.momentList.reset(this.object.moments)
		console.log(this.object.moments)

	}

	openColorWheelAction(view, el, e) {

		console.log(this, el, e)
		var id = this.object.devices[0].id
		var devRgb = lights.app.devices[id].channels[0].rgb
		var factor = 255 / (Math.pow(127, 2) - 1)
		var rgb = [Math.round(devRgb[0] * factor), Math.round(devRgb[1] * factor), Math.round(devRgb[2] * factor)]
		this.owner.owner.owner.showView(new lrs.views.ColorWheel({room: this.object, rgb: rgb }))

	}

	addMomentAction() {

		console.log(this)
		var room = this
		this.owner.owner.owner.showView(new lrs.LRSView.views.NewMomentPageView({room: room}))

	}

}

window.lrs.LRSView.views.RoomListItemView = RoomListItemView