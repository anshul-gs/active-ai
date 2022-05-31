const mongoose = require('mongoose');

var CartSchema = new mongoose.Schema({
    name: String,
    price: String,
    userId: String,
});

module.exports = mongoose.model('Cart', CartSchema);