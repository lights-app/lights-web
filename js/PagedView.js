'use strict';

class PagedView extends lrs.LRSView {
	
	constructor(args) {
		
		super(args)
		
		this.overlayEl = document.createElement('div')
		this.overlayEl.classList.add('page-shadow-overlay')
		
		if (this.views.preloaded) {
			
			this.views.content = Array.isArray(this.views.preloaded) ? this.views.preloaded : [this.views.preloaded]
			delete this.views.preloaded
			
		} else {
			
			this.views.content = []
		}
		
		if (this.views.content.length > 0) {
			
			this.updateViewHeader(this.views.content[this.views.content.length - 1], this.views.content[this.views.content.length - 2])
			//@updateHeaderColor(@views.content[@views.content.length - 1], true)
			
		}
		
	}
	
	showView(view) {
		
		var currentView = this.views.content[this.views.content.length - 1]
		
		if (currentView === view) return this
		
		var i = this.views.content.indexOf(view)
		
		if (i >= 0) {
			
			var removedViews = this.views.content.splice(i + 1, this.views.content.length)
			
			view.enable()
			
			this.animate('right', view, currentView).then( function() {
				
				for (let _view of removedViews) {
					
					_view.remove().deconstruct()
					
				}
				
			})
			
			// @updateHeaderColor(view)
			
		} else {
			
			view.enable().show().appendTo(this, 'content')
			
			this.updateViewHeader(view, currentView)
			
			this.animate('left', view, currentView)
		}
		
		return this
		
	}
	
	updateViewHeader(view, parentView) {
		
		if (this.views.content[0] === view) {
			
			view.updateBackButton(false)
			
		} else if (parentView && parentView.title) {
			
			view.updateBackButton(parentView.title)
			
		}
		
		return this
		
	}
	
	animate(direction, inView, outView) {
		
		inView.show()
		if (outView) outView.hide()
		
		return Promise.resolve()
		
	}
	
	backAction(...args) {
		
		if (this.views.content.length === 1) {
			
			return this.dispatch('closeAction', args)
			
		}
		
		return this.showView(this.views.content[this.views.content.length - 2])
		
	}
	
}

class PageView extends lrs.LRSView {
	
	updateBackButton(title) {
		
		if (title === false) {
			
			this.views.backBtn.title = ''
			this.views.backBtn.classList.add('close')
			
		} else {
			
			this.views.backBtn.title = title
			
		}
		
	}

	/*getAnimationEls() {
		
		if (this.els) return this.els
		
		this.toolbarEl = this.el.querySelector('.toolbar')
		
		this.els = {
			header: {
				back: null,
				title: null,
				other: []
			},
			content: this.el.querySelector('.page-content')
		}
		
		for (let childEl of this.toolbarEl.children) {
			
			
			
		}
		
	}*/

}

window.lrs.LRSView.views.PagedView = PagedView
window.lrs.LRSView.views.PageView = PageView