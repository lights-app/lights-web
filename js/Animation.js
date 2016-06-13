class Animation {

	constructor(el) {

		this.el = el

		return this

	}

	from(properties) {

		this.constructor.dynamics.css(this.el, properties)

		return this

	}

	to(properties, options) {
		return new Promise( (resolve, reject) => {

			var newOptions = Object.assign(options)

			newOptions.complete = resolve

			/*newOptions.complete = function() {

				if (originalCompleteHandler) originalCompleteHandler.apply(this, arguments)

				resolve()

			}*/

			this.constructor.dynamics.animate(this.el, properties, newOptions)

		})

	}

}

Animation.dynamics = dynamics

let animate = (el) => new Animation(el)