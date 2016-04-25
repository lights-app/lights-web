'use strict';

class SetupLoginView extends lrs.LRSView.views.PageView {
	
	constructor(el, options) {
		
		if (!options) options = {}
		options.template = 'SetupLogin'
		
		super(el, options)
		
		this.el.querySelector('form').addEventListener('submit', function(e) { e.preventDefault() })

		return this
		
	}

	loginAction(view, el, e) {
		
		var _this = this
		
		this.disable()
		
		lights.app.particle.login({username: this.username, password: this.password}).then( function(response) {
			
			lights.app.accessToken = response.body.access_token
			lights.app.refreshToken = response.body.refresh_token
			
			_this.owner.showView(new lrs.LRSView.views.DevicesPageView())
			
		}).catch( function(err) {
			
			_this.enable()
			console.error(err)
			window.alert('Something went wrong')
			
		})
		
	}

}

window.lrs.LRSView.views.SetupLoginView = SetupLoginView