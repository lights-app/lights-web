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

		this.colorWheelBgClicked = false

		// The current brightness of the lights, range 0-1
		this.brightness = 0
		// The range (in degrees) visible around the color wheel in degrees
		this.brightnessSliderRange = 330
		this.brightnessSliderAngleOffset = (360 - this.brightnessSliderRange) / 2
		this.brightnessStartAngle = this.brightness * this.brightnessSliderRange + this.brightnessSliderAngleOffset
		this.brightnessCurrentAngle = 0
		// The current color of the lights
		this.color

		this.views.favouriteColorsList.reset(lights.app.favouriteColors)
		this.views.roomDeviceList.reset(args.room.devices)

		return this

	}

	closeAction() {

		this.owner.showView(this.owner.views.content[0])
		
	}

	brightnessTouchstartAction(view, el, e) {

		var self = this

		console.log(this, el, e)
		this.mouseStart = [e.clientX, e.clientY]
		
		// document.body.addEventListener('mousemove', self.setBrightnessSlider)

		// this.mousemoveBind = self.setBrightnessSlider.bind(this, e)

		document.addEventListener('mousemove', self._mouseMove = function(e) {

			var angle = self.brightnessStartAngle + self.getAngle(e)[1]

			if (angle >= self.brightnessSliderAngleOffset && angle <= 360 - self.brightnessSliderAngleOffset){

				self.brightness = (angle - self.brightnessSliderAngleOffset) / self.brightnessSliderRange
				self.brightnessCurrentAngle = angle
				console.log("brightness", self.brightness)
				self.setBrightnessSlider(angle)

			} else if (angle < self.brightnessSliderAngleOffset) {

				self.brightness = 0
				self.brightnessCurrentAngle = self.brightnessSliderAngleOffset
				self.setBrightnessSlider(self.brightnessSliderAngleOffset)

			} else if (angle > 360 - self.brightnessSliderAngleOffset) {

				self.brightness = 1
				self.brightnessCurrentAngle = 360 - self.brightnessSliderAngleOffset
				self.setBrightnessSlider(360 - self.brightnessSliderAngleOffset)

			}

		})

		document.addEventListener('mouseup', function(e){

			document.removeEventListener('mousemove', self._mouseMove)
			self.brightnessStartAngle = self.brightnessCurrentAngle

		})

	}

	setBrightnessSlider(angle) {

		console.log(angle)
		// console.log(el)
		// console.log(e)

		this.views.brightnessSliderArm.el.style["transform"] = "rotate3d(0, 0, 1, " + angle + "deg)" 

	}

	colorWheelTouchstartAction(view, el, e) {

		var self = this

		// Add class while user is using the color wheel picker
		this.views.colorWheelBg.views.colorWheelArm.views.colorWheelPicker.classList.add('active')

		console.log(this, el, e)

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
		self.setColorWheelPicker(angle[2], radius)
		console.log(angle[0], radius)

		document.addEventListener('mousemove', self._mouseMove = function(e) {

			coordinates = [e.clientX - midPoint[0], e.clientY - midPoint[1]]
			angle = self.getAngle(e)
			radius = Math.sqrt( Math.pow(coordinates[0], 2) + Math.pow(coordinates[1], 2))
			console.log(angle[0], radius)

			self.setColorWheelPicker(angle[2], radius)

		})

		document.addEventListener('mouseup', function(e){

			document.removeEventListener('mousemove', self._mouseMove)

			// Remove class when user is done using the color picker
			self.views.colorWheelBg.views.colorWheelArm.views.colorWheelPicker.classList.remove('active')

		})
		


	}

	setColorWheelPicker(angle, radius) {

		console.log(this)

		var maxRadius = this.views.colorWheelBg.el.getBoundingClientRect().width / 2

		// Prevent the colorWheelPicker from getting out of the circle
		if (radius >= maxRadius) {

			radius = maxRadius

		}

		this.views.colorWheelBg.views.colorWheelArm.el.style["transform"] = "rotate3d(0, 0, 1, " + -angle + "deg)"
		this.views.colorWheelBg.views.colorWheelArm.views.colorWheelPicker.el.style["transform"] = "translate3d(" + radius + "px, 0, 0)" + " rotate3d(0, 0, 1, " + angle + "deg)"

		var rgb = lights.app.HSVtoRGB(angle / 360, radius / maxRadius, this.brightness)
		console.log(rgb)

		this.views.colorWheelBg.views.colorWheelArm.views.colorWheelPicker.el.style["background-color"] = "rgb(" + rgb.r + ", " + rgb.g + ", " + rgb.b + ")"

	}

	getAngle(e) {

		var radToDeg = 180 / Math.PI

		var relativeAngle = 0

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
		console.log("startAngle", startAngle)

		// Calculate the coordinates (X and Y) of the current cursor position
		var currentCoordinates = [e.clientX - midPoint[0], e.clientY - midPoint[1]]
		// console.log("currentCoordinates", currentCoordinates)

		// Calculate the angle between the startangle and the user's current cursor position
		// var currentAngle = Math.atan(currentCoordinates[1] / currentCoordinates[0]) * radToDeg
		var currentAngle = (Math.atan2(currentCoordinates[0], currentCoordinates[1] * -1) * radToDeg) + 180
		console.log("currentAngle", currentAngle)

		// Calculate the angle with refernce to the positive X-axis, counter clockwise
		var standardAngle = (Math.atan2(currentCoordinates[1], currentCoordinates[0] * -1) * radToDeg) + 180

		relativeAngle = currentAngle - startAngle

		console.log("standardAngle", standardAngle)

		// Check if the cursor is on the positive X-axis
		// if (currentCoordinates[0] >= 0) {

		// 	angle += 180

		// }
		// var startAngle = this.

		// return Both the relative angle, and the angle with reference to the Y-axis
		return [currentAngle, relativeAngle, standardAngle]

	}

	onOffClickAction() {

		console.log("onoff")

	}

}

lrs.View.register(ColorWheelView)