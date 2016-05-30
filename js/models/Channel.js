'use strict';

class Channel extends lrs.LRSObject {
	
	constructor() {

		super()

		this.rgb = [3]

		this.isOn = false
		
	}

}

window.lights.Channel = Channel