'use strict';
	
class App extends lrs.LRSView {
	
	constructor(el, options) {
		
		super(el, options)

		this.devices = []

		this.accessToken = window.localStorage.accessToken || null
		this.refreshToken = window.localStorage.refreshToken || null
				
		return this
			
	}
	
	get user() {
		
		return this._user
		
	}
	
	set user(user) {
		
		this._user = user
		
		window.localStorage.user = user
		
	}

	get accessToken() {

		return this._accessToken

	}

	set accessToken(accessToken) {

		this._accessToken = accessToken

		window.localStorage.accessToken = accessToken

	}

	get refreshToken() {

		return this._refreshToken

	}

	set refreshToken(refreshToken) {

		this._refreshToken = refreshToken

		window.localStorage.refreshToken = refreshToken

	}
	
}

window.lights = window.lights || {}
window.lights.App = App