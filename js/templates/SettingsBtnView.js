'use strict';

class SettingsBtnView extends lrs.LRSView {
	
	get template() { return 'SettingsBtn' }

	constructor(args) {

		super(args)

		return this

	}

}

lrs.View.register(SettingsBtnView)