class Collection extends lrs.mix().with(lrs.Events) {

	constructor(model = Object, records = []) {
		
		super()
		
		this.model = model
		
		this.records = []
		this.recordsById = {}
		
		this.reset(records)
		
	}

	get size() {
		
		return this.records.length
		
	}

	get(id) {
		
		return this.objectsById[id]
		
	}

	add(record, options = {}) {
		
		if (this.records.indexOf(record) >= 0) return
		
		this.records.push(record)
		if (record.id) this.recordsById[record.id] = record
		
		if (!options.silent && this.trigger) this.trigger('add', [record, this])

	}

	delete(record, options = {}) {
		
		var index = this.records.indexOf(record)
		
		if (index < 0) return
		
		this.records.splice(index, 1)
		delete this.recordsById[object.id]
		
		if (!options.silent && this.trigger) this.trigger('remove', [record, this])

	}

	reset(records, options = {}) {
		
		this.records = []
		this.recordsById = {}
		
		for (let record of records) {
			
			if (!(record instanceof (this.model || this))) record = new this.model(record)
			
			this.add(record, { silent: true })
			
		}
		
		if (!options.silent && this.trigger) this.trigger('reset', [this.records, this])
		
	}

	toJSON() {
		
		return this.records.map( function(record) { return record.toJSON() })
		
	}

}

// TODO: Add entries, keys and values iterators?

Collection.prototype[Symbol.iterator] = function*() {
	
	for (let record of this.records) {
		
		yield record
		
	}
	
}

lights.Collection = Collection