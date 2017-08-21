const mongoose = require('mongoose');

const tripSchema = mongoose.Schema({
	milesTraveled: {
		type: Number,
		required: true
	},
	date: {
		type: Date,
		required: true
	}
})

tripSchema.methods.apiRepr = function(){
	return{
		id: this._id,
		milesTraveled: this.milesTraveled,
		date: this.date
	}
}

const Trip = mongoose.model('Trip', tripSchema);

module.exports = {Trip};