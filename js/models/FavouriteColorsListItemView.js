'use strict';

class FavouriteColorsListItemView extends lrs.views.ListItem {

	get template() { return 'FavouriteColorsListItem'}

	get object() {

		return this._object

	}

	set object(object) {

		console.log(this)

		this._object = object

		this.name = this.object.name
		this.icon = this.object.icon
		this.el.style["background-color"] = "rgb(" + this.object[0] + ", " + this.object[1] + ", " + this.object[2] + ")" 

	}

	selectAction() {
		
		var self = this

		this.selected = !this.selected

		for (let color of this.owner.views.content) {

			if (color !== self) {

				color.classList.remove('selected') 
				color.selected = false

			} else {

				color.classList.add('selected')
				color.selected = true

			}

		}

	}

}

lrs.View.register(FavouriteColorsListItemView)