class App extends lrs.View {
	
	constructor({el, template, options = {}} = {}) {
		
		options.delayDomConnectionCreation = true
		
		super({el, template, options})

		var self = this
		
		window.lights.app = this
		
		this.didLoginToParticle = this.didLoginToParticle.bind(this)
		this.eventStreamsConfigured = false
		this.roomsLoaded = false
		this.requiresParticleVersion = [0, 2, 2]

		navigator.geolocation.getCurrentPosition(function(e) {

			console.log(e)
			self.geolocation = e

			// Calculate sunrise and sunset times and convert it into seconds from 0:00
			self.suncalc = SunCalc.getTimes(new Date(), self.geolocation.coords.latitude, self.geolocation.coords.longitude)
			self.sunriseSeconds = (self.suncalc.sunrise.getHours() * 3600) + (self.suncalc.sunrise.getMinutes() * 60) + self.suncalc.sunrise.getSeconds()
			self.sunsetSeconds = (self.suncalc.sunset.getHours() * 3600) + (self.suncalc.sunset.getMinutes() * 60) + self.suncalc.sunset.getSeconds()
			console.log(self.sunrise)

		})
		
		this.devices = new lights.Collection()
		// Contains all Particle devices associated with this account
		this.particleDevices = []

		this.userSettings = {}
		
		// Load devices stored in localStorage to a temporary variable
		for (let device of this.storage('devices') || []) {
			this.devices.add(new lights.Device(device))
		}

		this.favouriteColors = this.storage('favouriteColors') || []

		this.interpolationTime = this.storage('interpolationTime') || 0.7

		this.roomIconList = [
			{name: "Living Room",
			icon: "static/img/icons/living-room.svg"
			},
			{name: "Kitchen",
			icon: "static/img/icons/kitchen.svg"
			},
			{name: "Bedroom",
			icon: "static/img/icons/bedroom.svg"
			},
			{name: "Guest Room",
			icon: "static/img/icons/guest-room.svg"
			},
			{name: "Hallway",
			icon: "static/img/icons/hallway.svg"
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

		console.log('Particle logged in', this.particle.isLoggedIn)

		if (this.particle.isLoggedIn) {
			

			this.setRooms()

			this.subscribeToEventStreams()
			
			this.views.setup.hide()
			this.views.rooms.show()

			// Call Particle.listDevices to get a list with up-to-date properties
			var particleDevices = this.particle.listDevices()

			// Iterate over list and set connected status of our devices
			particleDevices.then( (devices) => {

				for (var device of devices.body) {

					this.particleDevices.push(lights.Device.fromParticleDevice(device))

					if (this.devices.recordsById[device.id]) {

						this.devices.recordsById[device.id].connected = device.connected
						this.devices.recordsById[device.id].getConfig()

						console.log(this.devices.recordsById[device.id].version)

					}

				}

			})

		}
		
		return this
		
	}

	setRooms() {

		if (!this.roomsLoaded){

			// Take the same approach for the rooms as we did for lights.app.devices
			this._rooms = this.storage('rooms') || []
			this.rooms = []

			for (let room of this._rooms) {

				this.rooms.push(new lights.Room(room.name, room.icon, room.devices, room.moments))

			}

			this.roomsLoaded = true

			console.log("Rooms loaded", this.roomsLoaded, lights.app.rooms)

		}

	}

	subscribeToEventStreams() {

		console.log(this.eventStreamsConfigured)

		if (!this.eventStreamsConfigured){

			this.deviceStatusStream = this.particle.getEventStream({deviceId: 'mine', name: 'spark/status' }).then(function(stream) {
				stream.on('event', function(data) {

					console.log(data)

					var eventType = ""
					var deviceOnline

					if (data.data.indexOf('online') > -1) { 

						eventType = 'deviceCameOnline'
						deviceOnline = true

					}

					if (data.data.indexOf('offline') > -1) { 

						eventType = 'deviceWentOffline'
						deviceOnline = false

					}

					var event = new CustomEvent(eventType, {
						detail: {
							id: data.coreid
						}
					})

					document.dispatchEvent(event)

					console.log("Device", data.coreid, data.data)

					// Set device status
					for (let device of lights.app.devices.records) {

						if (device.id === data.coreid) {

							device.connected = deviceOnline

						}

					}

				})

			})

			this.configChangedStream = this.particle.getEventStream({deviceId: 'mine', name: 'configChanged'}).then(function(stream) {
				stream.on('event', function(data) {

					console.log(data)

					setTimeout( () => {

						console.log(lights.app.devices)

						var event = new CustomEvent('deviceConfigChanged', {
							detail: {
								id: data.coreid
							}
						})

						lights.app.devices.recordsById[data.coreid].config = data.data
						lights.app.devices.recordsById[data.coreid].parseConfig()

						document.dispatchEvent(event)

					}, 0)

					

				})

			})

			this.flashStatusStream = this.particle.getEventStream({deviceId: 'mine', name: 'spark/flash/status' }).then(function(stream) {
				stream.on('event', function(data) {

					console.log(data)

					var eventType = ""

					if (data.data.indexOf('started') > -1) { 

						eventType = 'flashStarted'

					}

					if (data.data.indexOf('success') > -1) { 

						eventType = 'flashSuccessful'

					}

					if (data.data.indexOf('failed') > -1) { 

						eventType = 'flashFailed'

					}

					var event = new CustomEvent(eventType, {
						detail: {
							id: data.coreid
						}
					})

					document.dispatchEvent(event)

					console.log("Flashing", data.coreid, data.data)

				})

			})

			this.eventStreamsConfigured = true

		}

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

	arraysEqual(a, b) {

		console.log('comparing', a, 'to', b)

		for(let i = 0; i < a.length; i++){

			if(a[i] !== b[i]) {

				console.warn('arrays not equal')

				return false

			}

		}
		return true

	}
	
}

const lights = window.lights = {}
window.lights.App = App