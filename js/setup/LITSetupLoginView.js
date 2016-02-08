'use strict';

class LITSetupLoginView extends lrs.LRSView.views.LITPageView {
	
	constructor(el, options) {
		
		super(el, options)
		
		this.el.querySelector('button') // e.preventDefault()
		
	}

	loginAction(view, el, e) {

		e.preventDefault()
		
		var _this = this
		
		
		
		this.disable()
		
		spark.login({username: this.username, password: this.password}).then( function(result) {
		
		_this.owner.views.devices.init()
			
			
		}).catch( function(err) {
			
			_this.enable()
			
			window.alert('Something went wrong')
			
		})
		
	}

}

window.lrs.LRSView.views.LITSetupLoginView = LITSetupLoginView