class MomentListItemView extends lrs.LRSView.views.LRSListItemView {
	
	// constructor({el, options}) {

	// 	if (!options) options = {}
	// 	options.template = 'RoomIconListItem'

	// 	super(el, options)
		
	// }

	get template() { return 'MomentListItem'}

	get object() {

		return this._object

	}

	set object(object) {

		this._object = object

		console.log(this)

		this.name = this.object.name

	}

	select() {

		var self = this

		this.selected = !this.selected

		var parentWidth = this.el.parentElement.offsetWidth
		var parentOffsetLeft = this.el.parentElement.offsetLeft
		var thisWidth = this.el.offsetWidth + parentOffsetLeft
		var thisOffsetLeft = this.el.offsetLeft
		var shiftAmount = -1 * thisOffsetLeft
		var selectedMomentIndex = Array.prototype.indexOf.call(this.el.parentElement.childNodes, this.el)
		var marginRight = this.el.currentStyle || window.getComputedStyle(this.el)
		marginRight = marginRight.marginRight

		this.el.style["transform"] = "translate3d(" + shiftAmount + "px, 0, 0)" 

		for (let moment of this.owner.views.content) {

			var i = Array.prototype.indexOf.call(this.el.parentElement.childNodes, moment.el)

			if (i < selectedMomentIndex) {

				moment.el.style["transform"] = "translate3d(" + (thisWidth + 10) + "px, 0, 0)" 

			} else if (i > selectedMomentIndex) {

				moment.el.style["transform"] = "" 

			}

			if (moment !== self) {

				moment.classList.remove('selected') 
				moment.selected = false

			} else {

				moment.classList.add('selected')
				moment.selected = true

			}

		}

	}

	selectAction(view, el, e) {

		var self = this

		for (let device of view.object.devices) {

			console.log(device)

			var colorData = []

			for (let i = 0; i < device.channelCount; i++) {

				console.log('Current', lights.app.devices.recordsById[device.id].channels[i].rgb, device.channels[i].rgb)
				colorData.push(device.channels[i].rgb)
				console.log(device.channels[i].rgb)

			}

			lights.app.devices.recordsById[device.id].sendColorData(colorData)

		}

		this.select()

	}

}

window.lrs.LRSView.views.MomentListItemView = MomentListItemView