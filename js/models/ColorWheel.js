'use strict';

class ColorWheelView extends lrs.views.Page {
	
	get template() {
		
		return 'ColorWheel'
		
	}

	constructor(args) {

		super(args)

		var self = this

		console.log(this)
		console.log(args)

		// Variable for the start values of a mouseclick/tap
		this.mouseStart = [0, 0]
		this.dragging = false
		
		this.room = args.room
		this.name = args.room.name
		this.devices = args.room. devices
		this.lastDataTransmission = Date.now()

		// The current color of the lights
		this.rgb = args.rgb
		console.log(this.rgb)
		this.hsv = lights.app.RGBtoHSV(this.rgb[0], this.rgb[1], this.rgb[2])

		this.prevRgb = []
		this.prevHsv = []

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

		document.addEventListener('deviceConfigChanged', function(e){

			return self.deviceConfigChangeHandler(e)

		})

		return this

	}

	closeAction() {

		this.owner.showView(this.owner.views.content[0])
		
	}

	brightnessTouchstartAction(view, el, e) {

		var self = this

		this.disableTransitions()

		this.dragging = true

		this.deselectFavouriteColor()

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

		document.addEventListener('mouseup', self._mouseUp = function(e){

			document.removeEventListener('mousemove', self._mouseMove)
			self._mouseMove = undefined
			clearInterval(self._dataSendInterval)
			// Send latest value
			self.sendData()

			self.enableTransitions()

			// Remove this event listener
			document.removeEventListener('mouseup', self._mouseUp)

			self.dragging = false

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

		this.disableTransitions()

		this.dragging = true

		this.deselectFavouriteColor()

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

		document.addEventListener('mouseup', self._mouseUp = function(e){

			document.removeEventListener('mousemove', self._mouseMove)
			self._mouseMove = undefined
			clearInterval(self._dataSendInterval)
			// Remove class when user is done using the color picker
			self.views.colorWheelBg.views.colorWheelArm.views.colorWheelSlideArm.views.colorWheelPicker.classList.remove('active')
			// Send latest value
			self.sendData()

			self.enableTransitions()

			// Remove this event listener
			document.removeEventListener('mouseup', self._mouseUp)

			self.dragging = false

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
		
		// The color wheel picker only has to show the hue and saturation. Brightness is handled by the color wheel picker scrim
		var rgb = lights.app.HSVtoRGB(this.hsv[0], this.hsv[1], 1)
		var r = Math.round(rgb[0])
		var g = Math.round(rgb[1])
		var b = Math.round(rgb[2])
		// console.log(rgb, this.hsv)
		this.views.colorWheelBg.views.colorWheelArm.views.colorWheelSlideArm.views.colorWheelPicker.el.style['background-color'] = "rgb(" + r + ", " + g + ", " + b + ")"

		this.views.favouriteColorsList.views.addFavouriteColorBtn.el.style['background-color'] = "rgb(" + r + ", " + g + ", " + b + ")"

	}

	setColorWheelBrightness() {

		this.views.colorWheelBg.views.colorWheelBgScrim.el.style['opacity'] = 0.9 - this.hsv[2]
		this.views.colorWheelBg.views.colorWheelArm.views.colorWheelSlideArm.views.colorWheelPicker.views.colorWheelPickerScrim.el.style['opacity'] = 1 - this.hsv[2]
		this.views.favouriteColorsList.views.addFavouriteColorBtn.views.addFavouriteColorBtnScrim.el.style['opacity'] = 1 - this.hsv[2]
		// this.setColorWheelPickerColor()

	}

	disableTransitions() {

		this.views.brightnessSliderArm.el.style['transition'] = 'all 0s'
		this.views.colorWheelBg.views.colorWheelBgScrim.el.style['transition'] = 'all 0s'
		this.views.colorWheelBg.views.colorWheelArm.el.style['transition'] = 'all 0s'
		this.views.colorWheelBg.views.colorWheelArm.views.colorWheelSlideArm.el.style['transition'] = 'all 0s'
		this.views.colorWheelBg.views.colorWheelArm.views.colorWheelSlideArm.views.colorWheelPicker.el.style['transition'] = 'all 0s'
		this.views.colorWheelBg.views.colorWheelArm.views.colorWheelSlideArm.views.colorWheelPicker.views.colorWheelPickerScrim.el.style['transition'] = 'all 0s'
		this.views.favouriteColorsList.views.addFavouriteColorBtn.el.style['transition'] = 'all 0s'
		this.views.favouriteColorsList.views.addFavouriteColorBtn.views.addFavouriteColorBtnScrim.el.style['transition'] = 'all 0s'

	}

	enableTransitions() {

		this.views.brightnessSliderArm.el.style['transition'] = ''
		this.views.colorWheelBg.views.colorWheelBgScrim.el.style['transition'] = ''
		this.views.colorWheelBg.views.colorWheelArm.el.style['transition'] = ''
		this.views.colorWheelBg.views.colorWheelArm.views.colorWheelSlideArm.el.style['transition'] = ''
		this.views.colorWheelBg.views.colorWheelArm.views.colorWheelSlideArm.views.colorWheelPicker.el.style['transition'] = ''
		this.views.colorWheelBg.views.colorWheelArm.views.colorWheelSlideArm.views.colorWheelPicker.views.colorWheelPickerScrim.el.style['transition'] = ''
		this.views.favouriteColorsList.views.addFavouriteColorBtn.el.style['transition'] = ''
		this.views.favouriteColorsList.views.addFavouriteColorBtn.views.addFavouriteColorBtnScrim.el.style['transition'] = ''

	}

	deselectFavouriteColor() {

		for (let color of this.views.favouriteColorsList.views.content) {

			console.log(color)
			color.classList.remove('selected') 
			color.selected = false

		}

	}

	deviceConfigChangeHandler(e) {

		console.log(e.detail.id)
		console.log(this)

		// While dragging, do nothing. And only 2 seconds after lastDataTransmission 
		// This prevents the color wheel from picking up 'echos' of our own data and resetting the picker
		if (!this.dragging && Date.now() - this.lastDataTransmission > 2000) {

			for (let device of this.devices) {

				if(device.id === e.detail.id) {

					this.setColorWheelPickerPosition(lights.app.devices[device.id].channels[0].hsv[0] * 360, lights.app.devices[device.id].channels[0].hsv[1])
					this.setBrightnessSlider(lights.app.devices[device.id].channels[0].hsv[2])

				}

			}

		}

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

				// var lightsDevice = lights.app.devices[devices.id]
				console.log(device.object.id)

				var data = []

				for (var i = 0; i < lights.app.devices[device.object.id].channelCount; i++) {

					data.push(this.rgb)

				}

				lights.app.devices[device.object.id].sendColorData(data)

			}

		}

		this.lastDataTransmission = Date.now()

	}

	onOffClickAction() {

		var self = this

		console.log(this)

		if (this.views.onOffBtn.el.dataset.ison === 'true') {

			this.views.onOffBtn.el.dataset.ison = 'false'
			this.views.onOffBtn.el.classList.remove('is-on')

		} else {

			this.views.onOffBtn.el.dataset.ison = 'true'
			this.views.onOffBtn.el.classList.add('is-on')

		}

		// for (let device of this.views.roomDeviceList.views.content) {

		// 	if(device.views.checkmark.checked) {

		// 		console.log(device)

		// 		// var lightsDevice = lights.app.devices[devices.id]
		// 		console.log(device.object.id)

		// 		lights.app.devices[device.object.id].turnOff()

		// 	}

		// }

	}

	addFavouriteColorAction() {

		var color = new lights.Color([Math.round(this.rgb[0]), Math.round(this.rgb[1]), Math.round(this.rgb[2])], 'rgb')

		console.log(color, this.rgb)

		var addColor = true

		for (let favouriteColor of this.views.favouriteColorsList.content) {

			console.log(favouriteColor)

			if (color.hex === favouriteColor.object.hex){

				favouriteColor.view.classList.add('shake')

				setTimeout(function() {

					favouriteColor.view.classList.remove('shake')

				}, 900)

				addColor = false

			}

		}

		if (addColor) {

			lights.app.favouriteColors.push(color)
			lights.app.storage('favouriteColors', lights.app.favouriteColors)
			this.views.favouriteColorsList.add(color)

		} else {

			console.log("Color already present in favouriteColors")

		}

		// Check if color is not already present in list
		// for (let favouriteColor of this.views.favouriteColorsList.content) {

		// 	console.log(favouriteColor.object)
		// 	var allSameChannels = true

		// 	for (var i = 0; i < favouriteColor.object.length; i++) {

		// 		if (favouriteColor.object[i] !== color[i]) {

		// 			allSameChannels = false

		// 		}

		// 	}

		// 	if(!allSameColors) {



		// 	}

		// }

	}

}

lrs.View.register(ColorWheelView)