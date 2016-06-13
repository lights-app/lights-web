class Color extends lrs.LRSObject {
	
	constructor(color, type) {

		super()

		this.rgb = []
		this.rgbFloat = []
		this.rgb14 = []
		this.hsv = []
		this.hex = ""
		this.hexPrefixed = ""
		this.rgbToRgb14Factor = (Math.pow(127, 2) - 1) / 255
		this.rgb14ToRgbFactor = 1 / this.rgbToRgb14Factor

		if (type === 'rgb') {

			this.rgbFloat = color
			this.rgb14 = [Math.round(color[0] * this.rgbToRgb14Factor), Math.round(color[1] * this.rgbToRgb14Factor), Math.round(color[2] * this.rgbToRgb14Factor)]
			this.rgb = [Math.round(color[0]), Math.round(color[1]), Math.round(color[2])]
			this.hsv = lights.app.RGBtoHSV(color[0], color[1], color[2])
			this.hex = lights.app.RGBtoHEX(this.rgb[0], this.rgb[1], this.rgb[2])
			this.hexPrefixed = "#" + this.hex

		}

		if (type === 'rgb14') {

			this.rgb14 = color
			this.rgbFloat = [color[0] * this.rgb14ToRgbFactor, color[1] * this.rgb14ToRgbFactor, color[2] * this.rgb14ToRgbFactor]
			this.rgb = [Math.round(this.rgbFloat[0]), Math.round(this.rgbFloat[1]), Math.round(this.rgbFloat[2])]
			this.hsv = lights.app.RGBtoHSV(this.rgbFloat[0], this.rgbFloat[1], this.rgbFloat[2])
			this.hex = lights.app.RGBtoHEX(this.rgb[0], this.rgb[1], this.rgb[2])
			this.hexPrefixed = "#" + this.hex

		}

		if (type === 'hsv') {

			this.hsv = color
			this.rgbFloat = lights.app.HSVtoRGB(this.hsv[0], this.hsv[1], this.hsv[2])
			this.rgb14 = [Math.round(this.rgbFloat[0] * this.rgbToRgb14Factor), Math.round(this.rgbFloat[1] * this.rgbToRgb14Factor), Math.round(this.rgbFloat[2] * this.rgbToRgb14Factor)]
			this.rgb = [Math.round(this.rgbFloat[0]), Math.round(this.rgbFloat[1]), Math.round(this.rgbFloat[2])]
			this.hex = lights.app.RGBtoHEX(this.rgb[0], this.rgb[1], this.rgb[2])
			this.hexPrefixed = "#" + this.hex

		}

		if (type === 'hex') {

			this.hex = color
			this.rgb = lights.app.HEXtoRGB(this.hex)
			this.rgbFloat = this.rgb
			this.rgb14 = [this.rgb[0] * this.rgbToRgb14Factor, this.rgb[1] * this.rgbToRgb14Factor, this.rgb[2] * this.rgbToRgb14Factor]
			this.hsv = lights.app.RGBtoHSV(this.rgb[0], this.rgb[1], this.rgb[2])
			this.hexPrefixed = "#" + this.hex

		}
		
	}

}

window.lights.Color = Color