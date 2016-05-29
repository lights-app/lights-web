'use strict';

class App extends lrs.View {
	
	constructor({el, template, options = {}} = {}) {
		
		options.delayDomConnectionCreation = true
		
		super({el, template, options})
		
		window.lights.app = this
		
		this.didLoginToParticle = this.didLoginToParticle.bind(this)

		this.devices = this.storage('devices') || []

		this.particleDevices = this.storage('particleDevices') || []

		this.rooms = this.storage('rooms') || []

		this.favouriteColors = this.storage('favouriteColors') || []

		this.roomIconList = [
			{name: "Living Room",
			icon: "static/img/icons/couch.svg"
			},
			{name: "Kitchen",
			icon: "static/img/icons/kitchen.svg"
			},
			{name: "Living Room",
			icon: "static/img/icons/couch.svg"
			},
			{name: "Kitchen",
			icon: "static/img/icons/kitchen.svg"
			}
		]

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

		console.log(this.particle.isLoggedIn)

		if (this.particle.isLoggedIn) {

			var self = this
			console.log(self)

			setTimeout( function() {
				console.log(self)
				self.views.setup.hide()
				self.views.rooms.showView(new lrs.views.RoomsOverview())
			}, 1)

		}
		
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

	HSVtoRGB(h, s, v) {
	    var r, g, b, i, f, p, q, t;
	    if (arguments.length === 1) {
	        s = h.s, v = h.v, h = h.h;
	    }
	    i = Math.floor(h * 6);
	    f = h * 6 - i;
	    p = v * (1 - s);
	    q = v * (1 - f * s);
	    t = v * (1 - (1 - f) * s);
	    switch (i % 6) {
	        case 0: r = v, g = t, b = p; break;
	        case 1: r = q, g = v, b = p; break;
	        case 2: r = p, g = v, b = t; break;
	        case 3: r = p, g = q, b = v; break;
	        case 4: r = t, g = p, b = v; break;
	        case 5: r = v, g = p, b = q; break;
	    }
	    return {
	        r: Math.round(r * 255),
	        g: Math.round(g * 255),
	        b: Math.round(b * 255)
	    };
	}
	
}

window.lights = window.lights || {}
window.lights.App = App