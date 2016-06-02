'use strict';

class Color extends lrs.LRSObject {
	
	constructor(color, type) {

		super()

		this.rgb = []
		this.rgbFloat = []
		this.hsv = []
		this.hex = ""

		if (type === 'rgb') {

			this.rgbFloat = color
			this.rgb = [Math.round(color[0]), Math.round(color[1]), Math.round(color[2])]
			this.hsv = lights.app.RGBtoHSV(color[0], color[1], color[2])
			this.hex = lights.app.RGBtoHEX(this.rgb[0], this.rgb[1], this.rgb[2])

		}

		if (type === 'hsv') {

			this.hsv = color
			this.rgbFloat = lights.app.HSVtoRGB(this.hsv[0], this.hsv[1], this.hsv[2])
			this.rgb = [Math.round(this.rgbFloat[0]), Math.round(this.rgbFloat[1]), Math.round(this.rgbFloat[2])]
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