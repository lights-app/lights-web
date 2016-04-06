'use strict';

class SetupLoginView extends lrs.LRSView.views.PageView {
	
	constructor(el, options) {
		
		if (!options) options = {}
		options.template = 'SetupLogin'
		
		super(el, options)
		
		this.el.querySelector('form').addEventListener('submit', function(e) { e.preventDefault() })
		
	}

	loginAction(view, el, e) {
		
		var _this = this		
		
		this.disable()
		
		spark.login({username: this.username, password: this.password}).then( function(result) {
		
			_this.owner.showView(new lrs.LRSView.views.DevicesPageView())
			
			
		}).catch( function(err) {
			
			_this.enable()
			
			window.alert('Something went wrong')
			
		})
		
	}

}

window.lrs.LRSView.views.SetupLoginView = SetupLoginView