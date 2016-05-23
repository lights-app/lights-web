'use strict';

class SetupLoginView extends lrs.LRSView.views.PageView {
	
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
			
			_this.owner.showView(new lrs.LRSView.views.DevicesPageView())
			
		}).catch( function(err) {
			
			_this.enable()
			console.error(err)
			window.alert('Something went wrong')
			
		})
		
	}

}

window.lrs.LRSView.views.SetupLoginView = SetupLoginView