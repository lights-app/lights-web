'use strict';

class DevicesSettingListView extends lrs.views.LRSListView {
	
	get template() {
		
		return 'DevicesSettingList'
		
	}

	constructor(el, options) {
	
		super(el, options)
		
		return this
	
	}

}

lrs.View.register(DevicesSettingListView)