class Model extends lrs.mix().with(lrs.Events) {
	
	constructor(attributes) {
		
		super()
		
		for (let attributeName of Object.keys(attributes)) {
		
			this[attributeName] = attributes[attributeName]
		
		}
		
		this.constructor.add(this)
		
		return this
		
	}
	
	toJSON() {
		
		return this
		
	}
	
}

Model.get = Collection.prototype.get
Model.add = Collection.prototype.add
Model.remove = Collection.prototype.remove
Model.records = []
Model.recordsById = {}

lights.Model = Model