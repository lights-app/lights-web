'use strict';

class Room extends lrs.LRSObject {
	
	constructor(name, icon, devices) {

		super()

		this.name = name

		this.icon = icon

		this.devices = devices

		this.moments = []
		
	}

}

window.lights.Room = Room