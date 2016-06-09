'use strict';

class SetupLoginView extends lrs.views.Page {
	
	get template() { return 'SetupLogin' }
	
	constructor(args) {
		
		super(args)

		var self = this

		console.log(this)
		
		this.el.querySelector('form').addEventListener('submit', function(e) { e.preventDefault() })

		for (let input of this.views.input) {

			input.el.addEventListener('focus', function(e) {

				var el = this.parentNode.getElementsByTagName('label')[0]

				return self.contentChanged(e, el)

			})

			input.el.addEventListener('blur', function(e) {

				var el = this.parentNode.getElementsByTagName('label')[0]

				return self.contentChanged(e, el)

			})

		}

		return this
		
	}

	loginAction(view, el, e) {
		
		var self = this

		console.log(this)
		
		this.disable()
		
		lights.app.particle.login({username: this.views.input[0].username, password: this.views.input[1].password}).then( function(response) {
			
			self.owner.showView(new lrs.views.DevicesPage())

			lights.app.subscribeToEventStreams()
			
		}).catch( function(err) {
			
			self.enable()
			console.error(err)
			window.alert('Something went wrong')
			
		})
		
	}

	contentChanged(e, el) {

		console.log(e)

		if(e.type === 'focus') {

			el.classList.add('minimize')

		} else if (e.type === 'blur' && e.target.value.length === 0) {

			el.classList.remove('minimize')

		}

	}

}

lrs.View.register(SetupLoginView)