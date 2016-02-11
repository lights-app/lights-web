'use strict';

class LITSetupLoginView extends lrs.LRSView.views.LITPageView {
	
	constructor(el, options) {
		
		if (!options) options = {}
		options.template = 'LITSetupLogin'
		
		super(el, options)
		
		this.el.querySelector('button') // e.preventDefault()
		
	}

	loginAction(view, el, e) {

		e.preventDefault()
		
		var _this = this
		
		
		
		this.disable()
		
		spark.login({username: this.username, password: this.password}).then( function(result) {
		
			_this.owner.showView(new lrs.LRSView.views.LITDevicesPageView())
			
			
		}).catch( function(err) {
			
			_this.enable()
			
			window.alert('Something went wrong')
			
		})
		
	}

}

window.lrs.LRSView.views.LITSetupLoginView = LITSetupLoginView