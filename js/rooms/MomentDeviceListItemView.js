class MomentDeviceListItemView extends lrs.LRSView.views.LRSListItemView {
	
	// constructor({el, options}) {

	// 	if (!options) options = {}
	// 	options.template = 'RoomIconListItem'

	// 	super(el, options)
		
	// }

	get template() { return 'MomentDeviceListItem'}

	get object() {

		return this._object

	}

	set object(object) {

		this._object = object

		console.log(this)

		this.name = this.object.roomName

	}

	selectAction() {

		var self = this

		this.selected = !this.selected

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

}

window.lrs.LRSView.views.MomentDeviceListItemView = MomentDeviceListItemView