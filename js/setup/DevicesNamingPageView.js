class DevicesNamingPageView extends lrs.views.Page {
	
	get template() { return 'DevicesNamingPage' }
	
	constructor(args) {
		
		super(args)

		this.views.deviceNamingList.reset(lights.app.devicesArray)
		
		return this
	}

	doneAction(view, el, e) {

		console.log(this)

		for (let device of this.views.deviceNamingList.content) {

			var newName = device.view.name
			console.log(lights.app.devices[device.object.id].roomName, newName)

			// Only rename the Device when the name has been changed
			if (lights.app.devices[device.object.id].roomName !== newName) {

				console.log("renaming", lights.app.devices[device.object.id].roomName, "to", newName)
				newName = "Lights__" + newName

				var rename = lights.app.particle.renameDevice({ deviceId: device.object.id, name: newName, auth: lights.app.particle.auth.accessToken})

				rename.then(

					function(data) {

						console.log('Device renamed successfully to ' + newName, data)

					}, function(err) {

						console.log('An error occured while renaming device to' + newName, err)

					}

					)

			}

		}
		
		this.owner.showView(new lrs.views.SetupCompletePage())

	}

}

lrs.View.register(DevicesNamingPageView)