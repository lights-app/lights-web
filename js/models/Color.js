'use strict';

class Color extends lrs.LRSObject {
	
	constructor(color, type) {

		super()

		this.rgb = []
		this.hsv = []
		this.hex = ""

		if (type === 'rgb') {

			this.rgb = color
			this.hsv = lights.app.RGBtoHSV(color[0], color[1], color[2])
			this.hex = lights.app.RGBtoHEX(color[0], color[1], color[2])

		}

		if (type === 'hsv') {

			this.hsv = color
			this.rgb = lights.app.HSVtoRGB(this.hsv[0], this.hsv[1], this.hsv[2])
			this.hex = lights.app.RGBtoHEX(this.rgb[0], this.rgb[1], this.rgb[2])

		}

		if (type === 'hex') {

			this.hex = color
			this.rgb = lights.app.HEXtoRGB(this.hex)
			this.hsv = lights.app.RGBtoHSV(this.rgb[0], this.rgb[1], this.rgb[2])

		}
		
	}

}

window.lights.Color = Color