'use strict';

class ColorWheelView extends lrs.views.Page {
	
	get template() {
		
		return 'ColorWheel'
		
	}

	constructor(args) {

		super(args)

		console.log(this)
		console.log(args)

		// Variable for the start values of a mouseclick/tap
		this.mouseStart = [0, 0]
		
		this.name = args.room.name

		// The current color of the lights
		this.rgb = args.rgb
		this.hsv = lights.app.RGBtoHSV(this.rgb[0], this.rgb[1], this.rgb[2])

		// The range (in degrees) visible around the color wheel in degrees
		this.brightnessSliderRange = 330
		// The offset from 0 degrees (based on the brightnessSliderRange)
		this.brightnessSliderAngleOffset = (360 - this.brightnessSliderRange) / 2

		// Set the color picker and brightness slider to their initial positions 
		this.setColorWheelPickerPosition(this.hsv[0] * 360, this.hsv[1])
		this.setBrightnessSlider(this.hsv[2])

		console.log(this.rgb, this.hsv)

		this.views.favouriteColorsList.reset(lights.app.favouriteColors)
		this.views.roomDeviceList.reset(args.room.devices)

		return this

	}

	closeAction() {

		this.owner.showView(this.owner.views.content[0])
		
	}

	brightnessTouchstartAction(view, el, e) {

		var self = this

		this.mouseStart = [0, 0]

		// Send data right now, and every 500ms
		this.sendData()
		
		this._dataSendInterval = setInterval(function(e) {

			self.sendData()

		}, 500)

		document.addEventListener('mousemove', self._mouseMove = function(e) {

			var value = (self.getAngle(e)[0] - self.brightnessSliderAngleOffset) / self.brightnessSliderRange

			self.setBrightnessSlider(value)

		})

		document.addEventListener('mouseup', function(e){

			document.removeEventListener('mousemove', self._mouseMove)
			self._mouseMove = undefined
			clearInterval(self._dataSendInterval)

		})

	}

	setBrightnessSlider(value) {

		if (value > 1) { value = 1 }
		if (value < 0) { value = 0 }

		this.hsv[2] = value
		this.rgb = lights.app.HSVtoRGB(this.hsv[0], this.hsv[1], this.hsv[2])

		var angle = (value * this.brightnessSliderRange) + this.brightnessSliderAngleOffset

		this.views.brightnessSliderArm.el.style["transform"] = "rotate3d(0, 0, 1, " + angle + "deg)"

		this.setColorWheelBrightness()

	}

	colorWheelTouchstartAction(view, el, e) {

		var self = this

		// Send data right now, and every 500ms
		this.sendData()

		this._dataSendInterval = setInterval(function(e) {

			self.sendData()

		}, 500)

		document.addEventListener('mousemove', self._mouseMove = function(e) {

			coordinates = [e.clientX - midPoint[0], e.clientY - midPoint[1]]

			angle = self.getAngle(e)

			radius = Math.sqrt( Math.pow(coordinates[0], 2) + Math.pow(coordinates[1], 2))
			radius = radius / maxRadius

			self.setColorWheelPickerPosition(angle[2], radius)

		})

		document.addEventListener('mouseup', function(e){

			document.removeEventListener('mousemove', self._mouseMove)
			self._mouseMove = undefined
			clearInterval(self._dataSendInterval)
			// Remove class when user is done using the color picker
			self.views.colorWheelBg.views.colorWheelArm.views.colorWheelSlideArm.views.colorWheelPicker.classList.remove('active')

		})

		// Add class while user is using the color wheel picker
		this.views.colorWheelBg.views.colorWheelArm.views.colorWheelSlideArm.views.colorWheelPicker.classList.add('active')

		// we calculate elPos each time to ensure that the centerPoint is always correct, even after resizing
		var elPos = this.views.colorWheelBg.el.getBoundingClientRect()
		// console.log(elPos)
		var midPoint = [(elPos.left + (elPos.width / 2)), (elPos.top + (elPos.height / 2))]
		var topLeft = [elPos.left, elPos.top]

		// Set the mouseStart to the midpoint of the color wheel
		// The user can click anywhere on the color wheel to start dragging, therefore this is an absolute 
		// angle/distance from the centerpoint.
		this.mouseStart = [midPoint[0], midPoint[1]]
		var coordinates = [e.clientX - midPoint[0], e.clientY - midPoint[1]]

		var angle = self.getAngle(e)

		var radius = Math.sqrt( Math.pow(coordinates[0], 2) + Math.pow(coordinates[1], 2))
		var maxRadius = this.views.colorWheelBg.el.getBoundingClientRect().width / 2
		radius = radius / maxRadius

		self.setColorWheelPickerPosition(angle[2], radius)

	}

	setColorWheelPickerPosition(angle, radius) {

		var maxRadius = this.views.colorWheelBg.el.getBoundingClientRect().width / 2

		// Prevent the colorWheelPicker from getting out of the circle
		if (radius >= 1) {

			radius = 1

		}

		// Snap to center
		if(radius <= 0.1) {

			radius = 0

		}

		// Since CSS uses positive numbers for clockwise turns, we have to flip the angle
		this.views.colorWheelBg.views.colorWheelArm.el.style["transform"] = "rotate3d(0, 0, 1, " + -angle + "deg)"

		// Set the position of the colorPicker along the X-axis
		this.views.colorWheelBg.views.colorWheelArm.views.colorWheelSlideArm.el.style["transform"] = "translate3d(" + radius * 100 + "%, 0, 0)"

		this.views.colorWheelBg.views.colorWheelArm.views.colorWheelSlideArm.views.colorWheelPicker.el.style['transform'] = " rotate3d(0, 0, 1, " + angle + "deg)"

		this.hsv = [angle / 360, radius, this.hsv[2]]
		var rgb = lights.app.HSVtoRGB(this.hsv[0], this.hsv[1], this.hsv[2])

		this.rgb = rgb

		this.setColorWheelPickerColor()

	}

	setColorWheelPickerColor() {
		// console.log(this.rgb)
		var r = Math.round(this.rgb[0])
		var g = Math.round(this.rgb[1])
		var b = Math.round(this.rgb[2])
		this.views.colorWheelBg.views.colorWheelArm.views.colorWheelSlideArm.views.colorWheelPicker.el.style['background-color'] = "rgb(" + r + ", " + g + ", " + b + ")"

	}

	setColorWheelBrightness() {

		this.views.colorWheelBg.views.colorWheelBgScrim.el.style['opacity'] = 1 - this.hsv[2]
		this.setColorWheelPickerColor()

	}

	getAngle(e) {

		var radToDeg = 180 / Math.PI

		// console.log(e, this)
		var elPos = this.views.colorWheelBg.el.getBoundingClientRect()
		// console.log(elPos)
		var midPoint = [(elPos.left + (elPos.width / 2)), (elPos.top + (elPos.height / 2))]
		// console.log(midPoint)

		// Calculate the coordinates (X and Y) of the starting cursor position with reference to the center
		var startCoordinates = [this.mouseStart[0] - midPoint[0], this.mouseStart[1] - midPoint[1]]
		// console.log("startCoordinates", startCoordinates)

		// Calculate the start angle, note that atan2 is normally used with flipped X and Y coordinates
		// We flip these again to calculate an angle with reference to the Y-axis instead of the X-axis
		// We also invert the value of the Y-axis point (startCoordinates[1]) to ensure that our 0 degree angle is facing downards

		var startAngle = (Math.atan2(startCoordinates[0], startCoordinates[1] * -1) * radToDeg) + 180
		

		// Calculate the coordinates (X and Y) of the current cursor position
		var currentCoordinates = [e.clientX - midPoint[0], e.clientY - midPoint[1]]
		// console.log("currentCoordinates", currentCoordinates)

		// Calculate the angle between the cursor coordinates and the negative Y-axis
		// var negYAngle = Math.atan(currentCoordinates[1] / currentCoordinates[0]) * radToDeg
		var negYAngle = (Math.atan2(currentCoordinates[0], currentCoordinates[1] * -1) * radToDeg) + 180

		// Calculate the angle with refernce to the positive X-axis, counter clockwise
		var posXAngle = (Math.atan2(currentCoordinates[1], currentCoordinates[0] * -1) * radToDeg) + 180

		var deltaAngle = negYAngle - startAngle


		// console.log("negative Y  angle", negYAngle)
		// console.log("deltaAngle", deltaAngle)
		// console.log("posXAngle", posXAngle)

		return [negYAngle, deltaAngle, posXAngle]

	}

	sendData() {

		var self = this

		console.log(this)

		for (let device of this.views.roomDeviceList.views.content) {

			if(device.views.checkmark.checked) {

				console.log(device)

				var lightsDevice = lights.Device.fromParticleDevice(device)
				console.log(lightsDevice)

				lightsDevice.encodeColors([self.rgb[0], self.rgb[1], self.rgb[2], self.rgb[0], self.rgb[1], self.rgb[2]])

			}

		}

	}

	onOffClickAction() {

		console.log("onoff")

	}

}

lrs.View.register(ColorWheelView)