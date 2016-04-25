'use strict';

class ParticleWrapper {
	
	constructor(options) {
		
		var self = this
		
		this.particle = new Particle(options)
		
		for (let method of Object.getOwnPropertyNames(Object.getPrototypeOf(this.particle))) {
			
			if (this[method]) continue
			
			this[method] = function(...args) {
				
				if (args.length === 0) args = [{}]
				if (this.auth) args[0].auth = this.auth.access_token
				
				return self.particle[method].apply(self.particle, args)
				
			}
			
		}
		
	}
	
	login(...args) {
		
		return this.particle.login.apply(this.particle, args).then( (response) => {
			
			this.auth = response.body
			
		})
		
	}
	
}