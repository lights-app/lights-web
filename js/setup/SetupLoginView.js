'use strict';

class SetupLoginView extends lrs.views.Page {
	
	get template() { return 'SetupLogin' }
	
	constructor(args) {
		
		super(args)
		
		this.el.querySelector('form').addEventListener('submit', function(e) { e.preventDefault() })

		return this
		
	}

	loginAction(view, el, e) {
		
		var _this = this
		
		this.disable()
		
		lights.app.particle.login({username: this.username, password: this.password}).then( function(response) {
			
			_this.owner.showView(new lrs.views.DevicesPage())
			
		}).catch( function(err) {
			
			_this.enable()
			console.error(err)
			window.alert('Something went wrong')
			
		})
		
	}

}

lrs.View.register(SetupLoginView)