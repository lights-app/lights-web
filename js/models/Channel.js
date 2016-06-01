'use strict';

class Channel extends lrs.LRSObject {
	
	constructor(rgb) {

		super()

		if(rgb.length === 3) {

			this.rgb = rgb
			
		} else {

			this.rgb = []
		}
		

		this.isOn = false
		
	}

}

window.lights.Channel = Channel