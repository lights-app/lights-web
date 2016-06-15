class SetupView extends lrs.views.Paged {
	
	startAction() {

		this.showView(new lrs.views.SetupLogin())
		
	}
	
}

lrs.View.register(SetupView)