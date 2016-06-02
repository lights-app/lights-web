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
		this.color = this.object
		this.el.style["background-color"] = "rgb(" + this.object.rgb[0] + ", " + this.object.rgb[1] + ", " + this.object.rgb[2] + ")" 

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
				// var hsv = lights.app.RGBtoHSV(this.object[0], this.object[1], this.object[2])
				// console.log(this.object)
				// console.log(hsv)
				this.owner.owner.setColorWheelPickerPosition(this.object.hsv[0] * 360, this.object.hsv[1])
				this.owner.owner.setBrightnessSlider(this.object.hsv[2])
				this.owner.owner.sendData()

				console.log(this)

			}

		}

	}

	deleteFavouriteColorAction(view, el, e) {

		console.log(this)

		var self = this

		for (let color of lights.app.favouriteColors) {

			console.log(this.object.hex, color)

			if (color.hex === this.object.hex) {

				console.log("found match for", color.hex, "in favouriteColors")

				this.classList.add('disappear')
				setTimeout(function(){

					// Delete from array
					lights.app.favouriteColors.splice(lights.app.favouriteColors.indexOf(color), 1)
					// Save array
					lights.app.storage('favouriteColors', lights.app.favouriteColors)
					// Remove from view
					self.remove()
					self.deconstruct()

				}, 300)

			}
			
		}

		// for (let color of lights.app.favouriteColors) {

		// 	console.log(color)

		// 	if (color === this.object) {

		// 		console.log(color)

		// 		this.classList.add('disappear')
		// 		setTimeout(function(){

		// 			// Delete from array
		// 			lights.app.favouriteColors.splice(lights.app.favouriteColors.indexOf(color), 1)
		// 			// Save array
		// 			lights.app.storage('favouriteColors', lights.app.favouriteColors)
		// 			// Remove from view
		// 			self.remove()

		// 		}, 300)

		// 	}

		// }

	}

}

lrs.View.register(FavouriteColorsListItemView)