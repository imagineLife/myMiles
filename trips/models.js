const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const tripSchema = mongoose.Schema({
	milesTraveled: {
		type: Number,
		required: true
	},
	date: {
		type: Date,
		required: true
	},
	user: { type: Schema.Types.ObjectId, ref: 'User'}
})

tripSchema.methods.apiRepr = function(){
	return{
		id: this._id,
		milesTraveled: this.milesTraveled,
		date: this.date,
		user: this.user
	}
}

const Trip = mongoose.model('trip', tripSchema);

module.exports = {Trip};