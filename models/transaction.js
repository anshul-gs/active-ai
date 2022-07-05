const mongoose = require('mongoose');

var TransactionSchema = new mongoose.Schema({
    date: String,
    type: String,
    amount: Number,
    referenceNo: String,
    toName: String,
    toCategory: String
}, { timestamps: true });

module.exports = mongoose.model('Transaction', TransactionSchema);