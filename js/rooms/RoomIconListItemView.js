class RoomIconListItemView extends lrs.views.ListItem {
	
	// constructor({el, options}) {

	// 	if (!options) options = {}
	// 	options.template = 'RoomIconListItem'

	// 	super(el, options)
		
	// }

	get template() { return 'RoomIconListItem'}

	get object() {

		return this._object

	}

	set object(object) {

		this._object = object

		this.name = this.object.name
		this.icon = this.object.icon

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

}

lrs.View.register(RoomIconListItemView)