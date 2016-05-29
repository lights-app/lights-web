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
		this.owner.owner.owner.showView(new lrs.views.ColorWheel({room: this.object, rgb: [20, 20, 20]}))

	}

	addMomentAction() {

		console.log(this)
		var room = this
		this.owner.owner.owner.showView(new lrs.LRSView.views.NewMomentPageView({room: room}))

	}

}

window.lrs.LRSView.views.RoomListItemView = RoomListItemView