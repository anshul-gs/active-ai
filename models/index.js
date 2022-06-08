const mongoose = require('mongoose');
mongoose.Promise = Promise;

var url = process.env.MONGODB_URL;
mongoose.connect(url, {
    useNewUrlParser: true
}).then(() => {
    console.log("Connected to DB!");
}).catch(err => {
    console.log("Error: cd ", err.message);
});

module.exports.Product = require('./product');
module.exports.Cart = require('./cart');
module.exports.Order = require('./order');