class RoomListItemView extends lrs.View.views.LRSListItemView {

	get template() { return 'RoomListItem'}

	get object() {

		return this._object

	}

	set object(object) {

		this._object = object

		var self = this

		this.room = object

		this.name = this.object.name
		this.icon = this.object.icon
		this.devices = this.object.devices
		console.log(this)
		this.views.momentList.reset(this.object.moments)
		console.log(this.object.moments)

		document.addEventListener('deviceConfigChanged', function(e){

			return self.deviceConfigChangedHandler(e)

		})

	}

	addMomentAction(view, el, e) {

		var room = this

		if (this.colorWheel) {

			this.colorWheel.remove()

		}

		var newMomentPage = new lrs.LRSView.views.NewMomentPageView({room: room})
		this.owner.owner.classList.add('hide')
		newMomentPage.appendTo(this.owner.owner.owner)

	}

	deviceConfigChangedHandler(e) {

		e.detail.id

		console.log(this)

		this.setLightsConfigColors()

		// for (let room of this.views.roomList.content) {

		// 	console.log(room)
			
		// }

	}

	setLightsConfigColors() {

		var style = "(left, "
		var channel = 0

		for (var i = 0; i < this.devices.length; i++) {

			var device = lights.app.devices[this.devices[i].id]

			console.log(device)

			for (var j = 0; j < device.channelCount; j++){

				if (i + j !== 0) {

					style += ", "

				}

				// Set the color. If undefined, set to black
				style += device.channels[j].hexPrefixed || "#000000"

				

			}

		}

		style += ")"

		var styleWebkit = "-webkit-linear-gradient" + style

		console.log(style)
		console.log(styleWebkit)

		if(this.views.lightsConfig1.views.lightsConfig2.classList.contains("active")) {

			this.views.lightsConfig1.el.style['background'] = styleWebkit
			this.views.lightsConfig1.views.lightsConfig2.classList.remove("active")

		} else {

			this.views.lightsConfig1.views.lightsConfig2.el.style['background'] = styleWebkit
			this.views.lightsConfig1.views.lightsConfig2.classList.add("active")

		}

		// this.views.lightsConfig.el.style['background'] = styleWebkit

	}

}

window.lrs.LRSView.views.RoomListItemView = RoomListItemView