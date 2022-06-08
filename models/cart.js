const mongoose = require('mongoose');

var CartSchema = new mongoose.Schema({
    name: String,
    price: String,
    userId: String,
    quantity: String,
}, { timestamps: true });

module.exports = mongoose.model('Cart', CartSchema);