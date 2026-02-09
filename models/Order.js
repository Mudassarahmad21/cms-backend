const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    client: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items: [{
        crop: { type: mongoose.Schema.Types.ObjectId, ref: "Crop", required: true },
        quantity: { type: Number, required: true }
    }],
    totalPrice: { type: Number, required: true },
    status: { type: String, enum: ["pending", "approved", "delivered"], default: "pending" }
}, { timestamps: true });

module.exports = mongoose.model("Order", orderSchema);