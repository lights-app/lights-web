class InterpolationTimePageView extends lrs.views.Page {
	
	get template() {
		
		return 'InterpolationTimePage'
		
	}

	constructor(el, options) {
	
		super(el, options)

		console.log(this)

		this.views.rangeSlider.setThumbPosByValue(lights.app.interpolationTime)

		this.views.rangeSlider.el.addEventListener('change', (e) => {

			console.log(e)

			return this.setInterpolationTime(e.detail.value)

		})
		
		return this
	
	}

	setInterpolationTime(value) {

		lights.app.interpolationTime = value
		lights.app.storage('interpolationTime', value)

	}

}

lrs.View.register(InterpolationTimePageView)