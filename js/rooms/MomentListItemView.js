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

	selectAction() {

		var self = this
		console.log(this)

		this.selected = !this.selected

		var parentWidth = this.el.parentElement.offsetWidth
		var thisWidth = this.el.offsetWidth
		var parentOffsetLeft = this.el.parentElement.offsetLeft
		var thisOffsetLeft = this.el.offsetLeft
		var shiftAmount = -1 * (thisOffsetLeft - parentOffsetLeft)
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

		// this.classList.add('selected')

	}

}

window.lrs.LRSView.views.MomentListItemView = MomentListItemView