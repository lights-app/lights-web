class Channel extends lrs.LRSObject {
	
	constructor(rgb) {

		super()

		try {

			if(rgb.length === 3) {

				this.rgb = rgb
				
			} else {

				this.rgb = []
			}

		} catch(err) {

			// Something went wrong. Set channel to black
			this.rgb = [0, 0, 0]

		}
		

		this.isOn = false
		
	}

}

window.lights.Channel = Channel