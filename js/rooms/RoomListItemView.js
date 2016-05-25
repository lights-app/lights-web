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

	toggleAction() {

		var self = this

		this.selected = !this.selected

		console.log(this)

		for (let icon of this.owner.views.content) {

			if (icon !== self) {

				icon.classList.remove('selected') 
				icon.selected = false

			} else {

				icon.classList.add('selected')
				icon.selected = true

			}

		}

		// this.classList.add('selected')

	}

	addMomentAction() {

		console.log(this)
		var room = this
		this.owner.owner.owner.showView(new lrs.LRSView.views.NewMomentPageView({room: room}))

	}

}

window.lrs.LRSView.views.RoomListItemView = RoomListItemView