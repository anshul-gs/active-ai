const mongoose = require('mongoose');

var OrderSchema = new mongoose.Schema({
    product: [
        {
            name: String,
            price: String,
        }
    ],
    userId: String,
}, { timestamps: true });

module.exports = mongoose.model('Order', OrderSchema);