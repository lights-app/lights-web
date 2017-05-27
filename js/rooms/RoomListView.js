'use strict';

class RoomListView extends lrs.views.LRSListView {
	
	get template() {
		
		return 'RoomList'
		
	}

	constructor(el, options) {

		super(el, options)

		this._roomListItemTouchMove = this._roomListItemTouchMove.bind(this)
		this._removeRoomListItemTouchMoveEventListeners = this._removeRoomListItemTouchMoveEventListeners.bind(this)

		// Variable for the start values of a mouseclick/tap
		this.mouseStart = [0, 0]
		this.dragging = false

		this.deltaX = 0
		this.offset = 0
		this.compoundX = 0

		return this

	}

	roomListItemTouchStartAction(view, el, e) {

		var self = this

		this.dragging = false

		this.touch = {}

		this.touch.view = view
		this.touch.el = el

		this.deleteRoomBtnWidth = view.views.deleteRoomBtn.el.offsetWidth

		this.roomListIconView = view
		this.deleteRoomButtonIconView = view.views.deleteRoomBtn.views.deleteRoomIcon

		console.log(this.deleteRoomButtonIconView)

		console.log(view)

		if (e.touches) {

			e.preventDefault()
			this.mouseStart = [e.touches[0].clientX, e.touches[0].clientY]

		} else {

			this.mouseStart = [e.clientX, e.clientY]

		}

		this.touch.deltaCoordinates = []

		document.addEventListener('mousemove', this._roomListItemTouchMove)
		document.addEventListener('touchmove', this._roomListItemTouchMove)

		document.addEventListener('mouseup', this._removeRoomListItemTouchMoveEventListeners)
		document.addEventListener('touchend', this._removeRoomListItemTouchMoveEventListeners)

		this.disableTransitions(this.touch.view.el)

	}

	_roomListItemTouchMove(e) {

		if (e.touches) {

			e.preventDefault()
			this.touch.coordinates = [e.touches[0].clientX, e.touches[0].clientY]

		} else {

			this.touch.coordinates = [e.clientX, e.clientY]

		}

		this.touch.deltaCoordinates[0] = this.touch.coordinates[0] - this.mouseStart[0]
		this.touch.deltaCoordinates[1] = this.touch.coordinates[1] - this.mouseStart[1]

		if (!this.dragging) {

			if(Math.abs(this.touch.deltaCoordinates[0]) > 20) {

				console.log('dragging')
				this.dragging = true

			}

		}

		if (this.dragging) {
			
			this.deltaX = this.touch.deltaCoordinates[0]
			this.compoundX = this.deltaX + this.offset
			this.compoundXDecelerated = this.deltaX + this.offset

			var sqrtOffset = 0
			
			if (this.compoundX < -this.deleteRoomBtnWidth) {

				sqrtOffset = Math.pow(Math.abs(this.compoundX + this.deleteRoomBtnWidth), 1/1.3)
				this.compoundXDecelerated = -this.deleteRoomBtnWidth - sqrtOffset

			}

			if (this.compoundX > 0) {

				this.compoundXDecelerated = 0

			}

			this.touch.view.el.style["transform"] = "translate3d(" + this.compoundXDecelerated + "px, 0, 0)"
			this.deleteRoomButtonIconView.el.style['transform'] = "translate3d(" + sqrtOffset / 2 + "px, 0, 0)"

		}

		console.log(this.deltaX, this.offset, this.compoundX, this.compoundXDecelerated)

		// console.log(this.touch.coordinates)
		// console.log(this.touch.deltaCoordinates[0], this.touch.deltaCoordinates[1])

	}

	_removeRoomListItemTouchMoveEventListeners(e) {

		document.removeEventListener('mousemove', this._roomListItemTouchMove)
		document.removeEventListener('touchmove', this._roomListItemTouchMove)
		document.removeEventListener('mouseup', this._removeRoomListItemTouchMoveEventListeners)
		document.removeEventListener('touchend', this._removeRoomListItemTouchMoveEventListeners)
		this._mouseMove = undefined

		// Remove this event listener
		document.removeEventListener('mouseup', this._mouseUp)

		if (!this.dragging && this.offset === 0) {

			this.openColorWheelAction(this.touch.view)
		}

		this.dragging = false

		// If the amount the user dragged is greater than the width of the delete button,
		// Then keep it in view
		if (this.deltaX < -this.deleteRoomBtnWidth) {

			this.offset = -this.deleteRoomBtnWidth

		} else {

			// Otherwise snap room back to original position
			this.offset = 0

		}

		console.log(this.deltaX)

		this.touch.view.el.style["transform"] = "translate3d(" + this.offset + "px, 0, 0)"
		this.deleteRoomButtonIconView.el.style['transform'] = ""

		this.enableTransitions(this.touch.view.el)

	}

	disableTransitions(el) {

		this.touch.view.el.style['transition'] = 'all 0s'
		this.deleteRoomButtonIconView.el.style['transition'] = 'all 0s'

	}

	enableTransitions(el) {

		this.touch.view.el.style['transition'] = ''
		this.deleteRoomButtonIconView.el.style['transition'] = ''

	}

	openColorWheelAction(view, el, e) {

		var id = view.object.devices[0].id
		
		var colorWheel = new lrs.views.ColorWheel({room: view.object, rgb: lights.app.devices.recordsById[id].channels[0].rgb})
		// lights.app.views.rooms.views.content[0].classList.add('hide')
		// colorWheel.appendTo(this.owner.owner, 'colorWheel')
		this.owner.owner.showView(colorWheel, 'colorWheel')
		// this.owner.owner.owner.showView()

	}

	deleteRoomAction(view, el, e) {

		var roomListItemView = view.owner

		var index = lights.app.rooms.indexOf(roomListItemView.object)

		roomListItemView.el.style['transform'] = ''

		roomListItemView.el.classList.add('deleted')

		setTimeout( () => {

			lights.app.rooms.splice(index, 1)

			lights.app.storage('rooms', lights.app.rooms)

			this.mouseStart = [0, 0]
			this.dragging = false

			this.deltaX = 0
			this.offset = 0
			this.compoundX = 0

			this.remove(roomListItemView.room)

		}, 500)

	}

}

lrs.View.register(RoomListView)