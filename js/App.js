'use strict';
	
class App extends lrs.LRSView {
	
	constructor(el, options) {
		
		if (!options) options = {}
		options.delayDomConnectionCreation = true
		
		super(el, options)
		
		window.lights.app = this
		
		this.didLoginToParticle = this.didLoginToParticle.bind(this)

		this.devices = []
			
		this.particle = new ParticleWrapper({
			baseUrl: 'https://api.particle.io',
			clientSecret: 'particle-api',
			clientId: 'particle-api',
			tokenDuration: 63072000, // 2 years
		}, {auth: this.storage('particleAuth')})
		this.particle.on('login', this.didLoginToParticle)
		
		if (this.accessToken) {
			
			this.particle.auth = {
				access_token: this.accessToken
			}
			
		}
		
		this.createDomConnections()
		
		return this
		
	}
	
	didLoginToParticle(auth) {
		
		this.storage('particleAuth', auth)
		
	}
	
	storage(key, value) {
		
		key = `lights.${key}`
		
		if (value === undefined) {
			
			value = window.localStorage[key]
			
			try {
				
				value = JSON.parse(value)
				
			} catch(err) {}
			
			return value
			
		} else {
			
			window.localStorage[key] = typeof value === 'object' ? JSON.stringify(value) : value
			
		}
		
	}
	
	get user() {
		
		return this._user
		
	}
	
	set user(user) {
		
		this._user = user
		
		window.localStorage.user = user
		
	}
	
}

window.lights = window.lights || {}
window.lights.App = App