const mongoose = require('mongoose');

var ProductSchema = new mongoose.Schema({
    name: String,
    price: String,
    image: String,
    desc: String,
    isGift: Boolean,
});

module.exports = mongoose.model('Product', ProductSchema);