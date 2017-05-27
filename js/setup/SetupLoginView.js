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

			switch(err.statusCode) {

				case 400:
				window.alert('Wrong username and/or password.')
				break;

				case 401:
				window.alert('Sorry, you are not authorised to do this.')
				break;

				case 403:
				window.alert('Sorry, this is forbidden.')
				break;

				case 408:
				window.alert('The login request timed out, please check your internet connection, or try again later. It could be that our services are temporarily down.')
				break;

				case 500: 
				window.alert('Something went wrong on our end, we\'re sorry. Please try again later.')
				break;

				case 503:
				window.alert('It appears the server is offline, please try again later. Or check http://status.particle.io/ to see current system status.')

				default:

				if (err.statusCode >= 500 && err.statusCode < 600) {

					window.alert('Something went wrong on our end, we\'re sorry.')

				} else {

					window.alert('Whoops, something went wrong, please check your credentials, try again later or contact the developer with the follwing information: ' + err.errorDescription)

				}

			}
			
		})
		
	}

	contentChanged(e, el) {

		if(e.type === 'focus') {

			el.classList.add('minimize')

		} else if (e.type === 'blur' && e.target.value.length === 0) {

			el.classList.remove('minimize')

		}

	}

}

lrs.View.register(SetupLoginView)