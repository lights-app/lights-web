'use strict';

class Moment extends lrs.LRSObject {
	
	constructor(name, devices) {

		super()

		this.name = name

		this.devices = devices

		this.moments = []
		
	}

}

window.lights.Moment = Moment