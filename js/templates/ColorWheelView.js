class ColorWheelView extends lrs.views.Page {
	
	get template() {
		
		return 'ColorWheel'
		
	}

	constructor(args) {

		super(args)

		var self = this

		// console.log(this)
		// console.log(args)

		this._colorWheelTouchMove = this._colorWheelTouchMove.bind(this)
		this._brightnessTouchMove = this._brightnessTouchMove.bind(this)
		this._removeBrightnessTouchMoveEventListeners = this._removeBrightnessTouchMoveEventListeners.bind(this)
		this._removeColorWheelTouchMoveEventListeners = this._removeColorWheelTouchMoveEventListeners.bind(this)

		// Variable for the start values of a mouseclick/tap
		this.mouseStart = [0, 0]
		this.dragging = false
		
		this.room = args.room
		this.name = args.room.name
		this.devices = args.room. devices
		this.lastDataTransmission = Date.now()

		// The current color of the lights
		this.rgb = args.rgb
		// console.log(this.rgb)
		this.hsv = lights.app.RGBtoHSV(this.rgb[0], this.rgb[1], this.rgb[2])

		this.prevRgb = []
		this.prevHsv = []

		// The range (in degrees) visible around the color wheel in degrees
		this.brightnessSliderRange = 315
		// The offset from 0 degrees (based on the brightnessSliderRange)
		this.brightnessSliderAngleOffset = (360 - this.brightnessSliderRange) / 2

		// Set the color picker and brightness slider to their initial positions 
		this.setColorWheelPickerPosition(this.hsv[0] * 360, this.hsv[1])
		this.setBrightnessSlider(this.hsv[2])

		// console.log(this.rgb, this.hsv)

		this.views.favouriteColorsList.reset(lights.app.favouriteColors)
		this.views.roomDeviceList.reset(args.room.devices)

		document.addEventListener('deviceConfigChanged', function(e){

			return self.deviceConfigChangedHandler(e)

		})

		setTimeout( () => {

			this.showFavouriteColors()

		}, 1000)

		return this

	}

	closeAction() {

		this.owner.showView(this.owner.views.content[0])
		
	}

	brightnessTouchstartAction(view, el, e) {

		var self = this

		console.log(view, el, e)

		this.disableTransitions()

		this.dragging = true

		this.deselectFavouriteColor()

		this.touch = {}
		// we calculate elPos each time to ensure that the centerPoint is always correct, even after resizing
		this.touch.elPos = this.views.colorWheelBg.el.getBoundingClientRect()
		// console.log(elPos)
		this.touch.midPoint = [(this.touch.elPos.left + (this.touch.elPos.width / 2)), (this.touch.elPos.top + (this.touch.elPos.height / 2))]
		this.touch.topLeft = [this.touch.elPos.left, this.touch.elPos.top]
		this.mouseStart = [0, 0]

		// Send data right now, and every 500ms
		this.sendData()
		
		this._dataSendInterval = setInterval(function(e) {

			self.sendData()

		}, lights.app.interpolationTime * 1000)

		document.addEventListener('mousemove', this._brightnessTouchMove)
		document.addEventListener('touchmove', this._brightnessTouchMove)

		document.addEventListener('mouseup', this._removeBrightnessTouchMoveEventListeners)
		document.addEventListener('touchend', this._removeBrightnessTouchMoveEventListeners)

	}

	_brightnessTouchMove(e) {

		console.log(this)

		if (e.touches) {

			e.preventDefault()
			this.touch.coordinates = [e.touches[0].clientX - this.touch.midPoint[0], e.touches[0].clientY - this.touch.midPoint[1]]

		} else {

			this.touch.coordinates = [e.clientX - this.touch.midPoint[0], e.clientY - this.touch.midPoint[1]]

		}

		this.touch.value = (this.getAngle(this.touch)[0] - this.brightnessSliderAngleOffset) / this.brightnessSliderRange

		this.setBrightnessSlider(this.touch.value)

	}

	_removeBrightnessTouchMoveEventListeners(e) {

		document.removeEventListener('mousemove', this._brightnessTouchMove)
		document.removeEventListener('touchmove', this._brightnessTouchMove)
		document.removeEventListener('mouseup', this._removeBrightnessTouchMoveEventListeners)
		document.removeEventListener('touchend', this._removeBrightnessTouchMoveEventListeners)
		this._mouseMove = undefined
		clearInterval(this._dataSendInterval)
		// Send latest value
		this.sendData()

		this.enableTransitions()

		// Remove this event listener
		document.removeEventListener('mouseup', this._mouseUp)

		this.dragging = false

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

		}, lights.app.interpolationTime * 1000)

		// Add class while user is using the color wheel picker
		this.views.colorWheelBg.views.colorWheelArm.views.colorWheelSlideArm.views.colorWheelPicker.classList.add('active')

		this.touch = {}
		// we calculate elPos each time to ensure that the centerPoint is always correct, even after resizing
		this.touch.elPos = this.views.colorWheelBg.el.getBoundingClientRect()
		// console.log(elPos)
		this.touch.midPoint = [(this.touch.elPos.left + (this.touch.elPos.width / 2)), (this.touch.elPos.top + (this.touch.elPos.height / 2))]
		this.touch.topLeft = [this.touch.elPos.left, this.touch.elPos.top]

		// Set the mouseStart to the midpoint of the color wheel
		// The user can click anywhere on the color wheel to start dragging, therefore this is an absolute 
		// angle/distance from the centerpoint.
		this.mouseStart = [this.touch.midPoint[0], this.touch.midPoint[1]]

		if (e.touches) {

			this.touch.coordinates = [e.touches[0].clientX - this.touch.midPoint[0], e.touches[0].clientY - this.touch.midPoint[1]]

		} else {

			this.touch.coordinates = [e.clientX - this.touch.midPoint[0], e.clientY - this.touch.midPoint[1]]

		}

		this.touch.angle = self.getAngle(this.touch)

		this.touch.radius = Math.sqrt( Math.pow(this.touch.coordinates[0], 2) + Math.pow(this.touch.coordinates[1], 2))
		this.touch.maxRadius = this.views.colorWheelBg.el.getBoundingClientRect().width / 2
		this.touch.radius = this.touch.radius / this.touch.maxRadius

		self.setColorWheelPickerPosition(this.touch.angle[2], this.touch.radius)

		document.addEventListener('mousemove', this._colorWheelTouchMove)
		document.addEventListener('touchmove', this._colorWheelTouchMove)

		document.addEventListener('mouseup', this._removeColorWheelTouchMoveEventListeners)
		document.addEventListener('touchend', this._removeColorWheelTouchMoveEventListeners)

	}

	_colorWheelTouchMove(e) {

		if (e.touches) {

			e.preventDefault()
			this.touch.coordinates = [e.touches[0].clientX - this.touch.midPoint[0], e.touches[0].clientY - this.touch.midPoint[1]]

		} else {

			this.touch.coordinates = [e.clientX - this.touch.midPoint[0], e.clientY - this.touch.midPoint[1]]

		}

		this.touch.angle = this.getAngle(this.touch)

		this.touch.radius = Math.sqrt( Math.pow(this.touch.coordinates[0], 2) + Math.pow(this.touch.coordinates[1], 2))
		this.touch.radius = this.touch.radius / this.touch.maxRadius

		this.setColorWheelPickerPosition(this.touch.angle[2], this.touch.radius)

	}

	_removeColorWheelTouchMoveEventListeners(e) {

		document.removeEventListener('mousemove', this._colorWheelTouchMove)
		document.removeEventListener('touchmove', this._colorWheelTouchMove)
		document.removeEventListener('mouseup', this._removeColorWheelTouchMoveEventListeners)
		document.removeEventListener('touchend', this._removeColorWheelTouchMoveEventListeners)
		this._mouseMove = undefined
		clearInterval(this._dataSendInterval)
		// Remove class when user is done using the color picker
		this.views.colorWheelBg.views.colorWheelArm.views.colorWheelSlideArm.views.colorWheelPicker.classList.remove('active')
		// Send latest value
		this.sendData()

		this.enableTransitions()

		// Remove this event listener
		document.removeEventListener('mouseup', this._mouseUp)

		this.dragging = false

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

			// console.log(color)
			color.classList.remove('selected') 
			color.selected = false

		}

	}

	deviceConfigChangedHandler(e) {

		// console.log(e.detail.id)
		// console.log(this)

		// While dragging, do nothing. And only 2 seconds after lastDataTransmission 
		// This prevents the color wheel from picking up 'echos' of our own data and resetting the picker
		if (!this.dragging && Date.now() - this.lastDataTransmission > 2000) {

			for (let device of this.devices) {

				console.log(device)

				if(device.id === e.detail.id) {

					this.setColorWheelPickerPosition(lights.app.devices.recordsById[device.id].channels[0].hsv[0] * 360, lights.app.devices.recordsById[device.id].channels[0].hsv[1])
					this.setBrightnessSlider(lights.app.devices.recordsById[device.id].channels[0].hsv[2])

				}

			}

		}

	}

	getAngle(touch) {

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
		var currentCoordinates = touch.coordinates
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

		// console.log(this)

		for (let device of this.views.roomDeviceList.views.content) {

			if(device.views.checkmark.checked) {

				// console.log(device)

				// var lightsDevice = lights.app.devices[devices.id]
				// console.log(device.object.id)

				var data = []
				
				for (var i = 0; i <  device.object.channelCount; i++) {

					// console.log(device.object)

					data.push(this.rgb)

				}

				lights.app.devices.recordsById[device.object.id].sendColorData(data)

			}

		}

		this.lastDataTransmission = Date.now()

	}

	onOffClickAction() {

		var self = this

		// console.log(this)

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

	showFavouriteColors() {

		for (let color of this.views.favouriteColorsList.content) {

			var timeout = this.views.favouriteColorsList.indexForView(color.view)

			setTimeout( () => {

				color.view.classList.add('bounce-in')
				color.view.classList.add('visible')

				setTimeout( () => {

					color.view.classList.remove('bounce-in')

				}, 700)

			}, 30 * timeout)

		}

		setTimeout( () => {

			this.views.favouriteColorsList.views.addFavouriteColorBtn.classList.add('bounce-in')

		}, 30 * this.views.favouriteColorsList.content.length)

	}

	hideFavouriteColors() {

		for (let color of this.views.favouriteColorsList.content) {

			var timeout = this.views.favouriteColorsList.indexForView(color.view)

			setTimeout( () => {

				color.view.classList.remove('bounce-in')
				color.view.classList.remove('visible')

			}, 30 * timeout)

		}

		setTimeout( () => {

			this.views.favouriteColorsList.views.addFavouriteColorBtn.classList.remove('bounce-in')

		}, 30 * this.views.favouriteColorsList.content.length)

	}

	addFavouriteColorAction() {

		var color = new lights.Color([Math.round(this.rgb[0]), Math.round(this.rgb[1]), Math.round(this.rgb[2])], 'rgb')

		// console.log(color, this.rgb)

		var addColor = true

		for (let favouriteColor of this.views.favouriteColorsList.content) {

			// console.log(favouriteColor)

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
			var view = this.views.favouriteColorsList.viewForObject(color)
			view.classList.add('selected')
			view.classList.add('bounce-in')

			setTimeout( () => {

				view.classList.remove('bounce-in')
				view.classList.add('visible')

			}, 700)

		} else {

			// console.log("Color already present in favouriteColors")

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