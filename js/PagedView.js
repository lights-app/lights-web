class PagedView extends lrs.View {
	
	constructor(args) {
		
		super(args)
		
		this.overlayEl = document.createElement('div')
		this.overlayEl.classList.add('page-shadow-overlay')
		
		if (!this.views.content) {
			
			this.views.content = []
			
		} else if (!Array.isArray(this.views.content)) {
			
			this.views.content = [this.views.content]
			
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
		
		var inEls = inView.animationEls
		var outEls = outView ? outView.animationEls : null
		
		var width = this.el.offsetWidth
		
		var duration = 650
		var points = [
			{ x: 0, y: 0, cp: [{ x: 0.23, y: 1 }] },
			{ x: 1, y: 1, cp: [{ x: 0.23, y: 1 }] }
		]
		
		var defaultOptions = {
			type: dynamics.bezier,
			duration,
			points
		}
		
		inView.show()
		
		// Animate content.
		var animation = animate(inEls.content).from({
			
			translateX: (direction === 'left' ? '100%' : '-100%')
			
		}).to({
			
			translateX: 0
			
		}, defaultOptions)
		
		// Animate back button and title.
		// TODO: Get alignment right.
		var dX = width / 2
		animate(inEls.toolbar.backBtn ? [inEls.toolbar.title, inEls.toolbar.backBtn] : inEls.toolbar.title).from({
			
			translateX: (direction === 'left' ? dX : -dX),
			opacity: 0
			
		}).to({
			
			translateX: 0,
			opacity: 1
			
		}, defaultOptions)
		
		// Animate other toolbar items.
		animate(inEls.toolbar.other).from({
			
			opacity: 0
			
		}).to({
			
			opacity: 1
			
		}, defaultOptions)
		
		// Animate out, if there's a view to animatie out.
		if (outView) {
			
			// Animate content.
			animate(outEls.content).to({
				
				translateX: (direction === 'left' ? -width / 2 : width)
				
			}, defaultOptions).then( function() {
				
				outView.hide()
				
			})
			
			// Animate back button and title.
			// TODO: Get alignment right.
			var dX = width / 2
			animate(outEls.toolbar.backBtn ? [outEls.toolbar.title, outEls.toolbar.backBtn] : outEls.toolbar.title).to({
				
				translateX: (direction === 'left' ? -dX : dX),
				opacity: 0
				
			}, defaultOptions)
			
			// Animate overlay.
			;(direction === 'left' ? outEls.content : inEls.content).appendChild(this.overlayEl)
			animate(this.overlayEl).from({
				
				opacity: (direction === 'left' ? 0 : 0.4)
				
			}).to({
				
				opacity: (direction === 'left' ? 0.4 : 0)
				
			}, defaultOptions).then( () => {
				
				;(direction === 'left' ? outEls.content : inEls.content).removeChild(this.overlayEl)
				
			})
			
			// Animate other toolbar items.
			animate(outEls.toolbar.other).to({
				
				opacity: 0
				
			}, defaultOptions)
			
		}
		
		return animation
		
	}
	
	backAction(...args) {
		
		if (this.views.content.length === 1) {
			
			return this.dispatch('closeAction', args)
			
		}
		
		return this.showView(this.views.content[this.views.content.length - 2])
		
	}
	
}

class PageView extends lrs.View {
	
	updateBackButton(title) {
		
		if (!this.views.backBtn) return
		
		if (title === false) {
			
			this.views.backBtn.title = ''
			this.views.backBtn.classList.add('close')
			
		} else {
			
			this.views.backBtn.title = title
			
		}
		
	}
	
	get animationEls() {
		
		if (!this._animationEls) {
			
			Object.defineProperty(this, '_animationEls', {
				configurable: false,
				enumerable: false,
				value: {
					toolbar: {
						backBtn: this.views.backBtn ? this.views.backBtn.el : null,
						title: null,
						other: []
					},
					content: this.el.querySelector('.page-content')
				}
			})
			
			for (let childEl of this.el.querySelector('.toolbar').children) {
				
				if (this.views.backBtn && childEl === this.views.backBtn.el) {
					
					continue
					
				} else if (childEl.tagName === 'H1') {
					
					this._animationEls.toolbar.title = childEl 
					
				} else {
					
					this._animationEls.toolbar.other.push(childEl)
					
				}
				
			}
			
		}
		
		return this._animationEls
		
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

lrs.View.register(PagedView)
lrs.View.register(PageView)