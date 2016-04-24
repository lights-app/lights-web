'use strict';

class LITSetupLoginView extends lrs.LRSView.views.LITPageView {
	
	constructor(el, options) {
		
		if (!options) options = {}
		options.template = 'LITSetupLogin'
		
		super(el, options)
		
		this.el.querySelector('form').addEventListener('submit', function(e) { e.preventDefault() })

		return this
		
	}

	loginAction(view, el, e) {
		
		var _this = this

		console.log(this.username, this.password)
		
		this.disable()
		
		spark.login({username: this.username, password: this.password}).then( function(result) {

			lit.app.accessToken = result.access_token
			lit.app.refreshToken = result.refresh_token

			_this.owner.showView(new lrs.LRSView.views.LITDevicesPageView())

			console.log(result)
			
		}).catch( function(err) {
			
			_this.enable()
			
			window.alert('Something went wrong')
			
		})
		
	}

}

window.lrs.LRSView.views.LITSetupLoginView = LITSetupLoginView