'use strict';
	
class LITApp extends lrs.LRSView {
	
	constructor(el, options) {
		
		super(el, options)

		this.devices = []
		
		return this
			
	}
	
	get user() {
		
		return this._user
		
	}
	
	set user(user) {
		
		this._user = user
		
		window.localStorage.user = user
		
	}
	
}

window.lit = window.lit || {}
window.lit.LITApp = LITApp