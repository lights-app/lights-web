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

		this.owner.showView(new lrs.views.InterpolationTimePage())

	}

	devicesSettingAction(view, el, e) {

		this.owner.showView(new lrs.views.DevicesSettingPage())

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

	closeAction() {

		this.owner.showView(this.owner.views.content[0])
		
	}

}

lrs.View.register(SettingsPageView)