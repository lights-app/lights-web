'use strict';

class App extends lrs.View {
	
	constructor({el, template, options = {}} = {}) {
		
		options.delayDomConnectionCreation = true
		
		super({el, template, options})

		var self = this
		
		window.lights.app = this
		
		this.didLoginToParticle = this.didLoginToParticle.bind(this)
		this.requiresParticleVersion = [0, 0, 0]

		navigator.geolocation.getCurrentPosition(function(e) {

			console.log(e)
			self.geolocation = e

			// Calculate sunrise and sunset times and convert it into seconds from 0:00
			self.suncalc = SunCalc.getTimes(new Date(), self.geolocation.coords.latitude, self.geolocation.coords.longitude)
			self.sunriseSeconds = (self.suncalc.sunrise.getHours() * 3600) + (self.suncalc.sunrise.getMinutes() * 60) + self.suncalc.sunrise.getSeconds()
			self.sunsetSeconds = (self.suncalc.sunset.getHours() * 3600) + (self.suncalc.sunset.getMinutes() * 60) + self.suncalc.sunset.getSeconds()
			console.log(self.sunrise)

		})

		// Load devices stored in localStorage to a temporary variable
		this._devices = this.storage('devices') || {}
		this.devices = {}

		// Create a devicesArray variable to store the devices in an array. Handy for view creation
		this.devicesArray = []

		// Then iterate over all devices and create new lights.Devices so all functions are set correctly
		for (let key in this._devices) {
			
			console.log(key)

			this.devices[key] = lights.Device.fromParticleDevice(this._devices[key])
			this.devicesArray.push(this.devices[key])

		}

		this.particleDevices = this.storage('particleDevices') || []

		this.rooms = this.storage('rooms') || []

		this.favouriteColors = this.storage('favouriteColors') || []

		this.interpolationTime = this.storage('interpolationTime') || 7

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

			console.log(self)

			setTimeout( function() {
				console.log(self)
				self.views.setup.hide()
				self.views.rooms.showView(new lrs.views.RoomsOverview())
			}, 1)

		}

		// After particle wrapper has been loaded, get the config of all devices
		for (let key in this.devices) {

			console.log("Getting device config for", key)
			
			console.log(key)

			this.devices[key].getConfig()

		}

		// Subscribe to device event stream to watch for changes
		this.particle.getEventStream({deviceId: 'mine', auth: this.particle.auth.accessToken}).then(function(stream) {
			stream.on('event', function(data) {
				console.log("Event:", data)

				if (data.name === "configChanged") {

					var event = new CustomEvent('deviceConfigChanged', {
						detail: {
							id: data.coreid
						}
					})

					self.devices[data.coreid].config = data.data
					self.devices[data.coreid].parseConfig()

					document.dispatchEvent(event)

				}
			})
		})
		
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

	getDevice(id) {



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
	    return [(r * 255), (g * 255), (b * 255)]
	}

	RGBtoHSV(r, g, b) {
	    if (arguments.length === 1) {
	        g = r.g, b = r.b, r = r.r;
	    }
	    var max = Math.max(r, g, b), min = Math.min(r, g, b),
	        d = max - min,
	        h,
	        s = (max === 0 ? 0 : d / max),
	        v = max / 255;

	    switch (max) {
	        case min: h = 0; break;
	        case r: h = (g - b) + d * (g < b ? 6: 0); h /= 6 * d; break;
	        case g: h = (b - r) + d * 2; h /= 6 * d; break;
	        case b: h = (r - g) + d * 4; h /= 6 * d; break;
	    }

	    return [h, s, v];
	}

	RGBtoHEX(r, g, b) {

		return (this.numberToHex(r) + this.numberToHex(g) + this.numberToHex(b))
	}

	HEXtoRGB(hex) {
	    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
	    return result ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)]: null
	}

	numberToHex(number) {

		var hex = number.toString(16)
    	return hex.length == 1 ? "0" + hex : hex

	}

	splitBytes(number, amountOfBytes, nonZero) {

		var result = []

		for (var i = 0; i < amountOfBytes; i++) {

			result[i] = Math.floor(number / Math.pow(127, (amountOfBytes - 1) - i))

			number -= result[i] * Math.pow(127, (amountOfBytes - 1) - i)

			// Add 1 if we can't send zero
			if(nonZero){ result[i]++ }
		}

		return result

	}

	combineBytes(bytes) {

		var result = 0

		for(var i = 0; i < bytes.length; i++) {

			result += bytes[i] * Math.pow(127, (bytes.length - 1) - i)
			// console.log(result)

		}

		return result

	}

	toBitString(number) {

		return("00000000" + number.toString(2)).substr(-8)

	}

	getBitValueAt(number, position) {

		return parseInt(this.toBitString(number).substring(position, position + 1))

	}
	
}

window.lights = window.lights || {}
window.lights.App = App