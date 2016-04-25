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

		console.log(this.username, this.password)
		
		this.disable()
		
		spark.login({username: this.username, password: this.password}).then( function(result) {

			lights.app.accessToken = result.access_token
			lights.app.refreshToken = result.refresh_token

			_this.owner.showView(new lrs.LRSView.views.DevicesPageView())

			console.log(result)
			
		}).catch( function(err) {
			
			_this.enable()
			
			window.alert('Something went wrong')
			
		})
		
	}

}

window.lrs.LRSView.views.SetupLoginView = SetupLoginView