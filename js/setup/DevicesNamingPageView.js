class DevicesNamingPageView extends lrs.views.Page {
	
	get template() { return 'DevicesNamingPage' }
	
	constructor(args) {
		
		super(args)

		this.views.deviceNamingList.reset(lights.app.devices.records)
		
		return this
	}

	doneAction(view, el, e) {
		
		for (let {object: device, view: deviceView} of this.views.deviceNamingList.content) {
			
			if (device.roomName !== view.name) {
				
				console.log("renaming", device.roomName, "to", deviceView.name)
				
				lights.app.particle.renameDevice({ deviceId: device.id, name: `Lights__${deviceView.name}` }).then( function(data) {
					
					console.log('Device renamed successfully to ' + deviceView.name, data)
					
				}, function(err) {
					
					console.error('An error occured while renaming device to' + deviceView.name, err)
					
				}
				
				)
				
			}
			
		}
		
		this.owner.showView(new lrs.views.SetupCompletePage())

	}

}

lrs.View.register(DevicesNamingPageView)