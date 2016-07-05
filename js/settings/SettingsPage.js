class SettingsPageView extends lrs.views.Page {
	
	get template() {
		
		return 'SettingsPage'
		
	}

	constructor(el, options) {
	
		super(el, options)

		this.userPrefs = {
			'lights.favouriteColors': true, 
			'lights.interpolationTime': true
		}
		
		return this
	
	}

	interpolationTimeSettingAction(view, el, e) {

		console.log(this)
		this.owner.showView(new lrs.views.InterpolationTimePage())

	}

	logoutAction(view, el, e) {

		console.log('logging out')

		if (window.confirm('Are you sure you want to log out?')) {

			var deleteUserPrefs = false

			if (window.confirm('Do you also want to delete user preferences such as favourite colors?')) {

				deleteUserPrefs = true

			}

			for (let key in window.localStorage) {

				if(deleteUserPrefs) {

					console.log('deleting', key)

					delete(window.localStorage[key])

				} else if (!this.userPrefs[key]) {

					console.log('deleting', key)

					delete(window.localStorage[key])

				} else {

					console.log('keeping', key)

				}

			}

			location.reload()

		}

	}

}

lrs.View.register(SettingsPageView)