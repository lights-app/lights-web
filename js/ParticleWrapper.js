class ParticleWrapper extends lrs.LRSObject {
	
	constructor(particleOptions, {auth}) {
		
		super()
		
		var self = this
		
		this.particle = new Particle(particleOptions)
		
		if (auth) {
			
			if (!(auth.expiry instanceof Date)) auth.expiry = new Date(auth.expiry)
			this.auth = auth
			
		}
		
		for (let method of Object.getOwnPropertyNames(Object.getPrototypeOf(this.particle))) {
			
			if (this[method]) continue
			
			this[method] = function(...args) {
				
				if (args.length === 0) args = [{}]
				if (this.auth) args[0].auth = this.auth.accessToken
				
				return self.particle[method].apply(self.particle, args)
				
			}
			
		}
		
	}
	
	login(...args) {
		
		return this.particle.login.apply(this.particle, args).then( (response) => {
			
			this.auth = {
				accessToken: response.body.access_token,
				refreshToken: response.body.refresh_token,
				expiry: new Date((new Date()).getTime() + response.body.expires_in * 1000)
			}
			
			this.trigger('login', [this.auth])
			
			return response
			
		})
		
	}
	
	get isLoggedIn() {
		
		return this.auth && this.auth.accessToken && this.auth.expiry > new Date()
		
	}
	
}