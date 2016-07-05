class RangeSliderView extends lrs.LRSView {
	
	get template() { return 'RangeSlider' }

	constructor(args) {

		super(args)

		this._sliderTouchMove = this._sliderTouchMove.bind(this)
		this._removeEventListeners = this._removeEventListeners.bind(this)

		this.unit = String(this.el.dataset.unit) || ''

		this.min = parseFloat(this.el.dataset.min)
		this.max = parseFloat(this.el.dataset.max)
		this.stepsize = parseFloat(this.el.dataset.stepsize)
		this.decimalPlaces = this._decimalPlaces(this.stepsize)

		this.stepCount = Math.floor((this.max - this.min) / this.stepsize)
		// The step size mapped to a 0-100% range
		this.mappedStepSize = 100 / this.stepCount
		this.currentStep

		// Set the slider to the position given, or to the minimum 
		this.setThumbPosByValue(this.el.dataset.value|| this.min)

		console.log(this)
		
		return this

	}

	touchstartAction(view, el, e) {

		this.touch = {}
		// we calculate elPos each time to ensure that the centerPoint is always correct, even after resizing
		this.touch.elPos = this.el.getBoundingClientRect()
		this.touch.midPoint = [(this.touch.elPos.left + (this.touch.elPos.width / 2)), (this.touch.elPos.top + (this.touch.elPos.height / 2))]
		this.touch.topLeft = [this.touch.elPos.left, this.touch.elPos.top]
		this.touch.width = this.touch.elPos.width

		document.addEventListener('mousemove', this._sliderTouchMove)
		document.addEventListener('touchmove', this._sliderTouchMove)

		document.addEventListener('mouseup', this._removeEventListeners)
		document.addEventListener('touchend', this._removeEventListeners)

	}

	_sliderTouchMove(e) {

		if (e.touches) {

			// e.preventDefault()
			this.touch.coordinates = [e.touches[0].clientX - this.touch.topLeft[0], e.touches[0].clientY - this.touch.topLeft[1]]

		} else {

			this.touch.coordinates = [e.clientX - this.touch.topLeft[0], e.clientY - this.touch.topLeft[1]]

		}

		this.touch.percentage = (this.touch.coordinates[0] / this.touch.width) * 100
		var step = Math.round(this.touch.percentage / this.mappedStepSize)

		this.setThumbPos(step)

		console.log(this.stepsize, step, this.currentStep, this.value)

	}

	setThumbPosByValue(value) {

		console.log(value)

		var step = (value - this.min) / this.stepsize
		this.setThumbPos(step)

	}

	setThumbPos(step) {

		if (step >= 0 && step <= this.stepCount && step !== this.currentStep) {

			this.views.track.el.style["transform"] = "translate3d(" + (step * this.mappedStepSize) + "%, 0, 0)"
			this.currentStep = step
			this.value = (this.min + (step * this.stepsize)).toFixed(this.decimalPlaces)

			this.views.track.views.thumb.views.output.el.innerHTML = String(this.value) + this.unit

			var event = new CustomEvent('change', {
				detail: {
					value: this.value
				}
			})

			this.el.dispatchEvent(event)

		}

		if (step < 0) {

			this.views.track.el.style["transform"] = "translate3d(" + (0 * this.mappedStepSize) + "%, 0, 0)"
			this.currentStep = step
			this.value = this.min + (0 * this.stepsize)

		}

		if (step > this.stepCount) {

			this.views.track.el.style["transform"] = "translate3d(" + (this.stepCount * this.mappedStepSize) + "%, 0, 0)"
			this.currentStep = step
			this.value = this.min + (this.stepCount * this.stepsize)

		}

	}

	_removeEventListeners(e) {

		document.removeEventListener('mousemove', this._sliderTouchMove)
		document.removeEventListener('touchmove', this._sliderTouchMove)
		document.removeEventListener('mouseup', this._removeEventListeners)
		document.removeEventListener('touchend', this._removeEventListeners)

	}

	_decimalPlaces(num) {

		num = String(num)
		return (num.split('.')[1] || []).length;

	}

}

lrs.View.register(RangeSliderView)