const mongoose = require('mongoose');

const cropSchema = new mongoose.Schema({
    name: { type: String, required: true },
    type: { type: String, required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
    farmer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    location: { type: String, required: true },
    status: { type: String, enum: ['available', 'sold'], default: 'available' }
}, { timestamps: true });

module.exports = mongoose.model('Crop', cropSchema);