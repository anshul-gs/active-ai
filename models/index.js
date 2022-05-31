const mongoose = require('mongoose');
mongoose.Promise = Promise;

var url = "mongodb+srv://anshul:anshul@cluster0.ojx6a1u.mongodb.net/?retryWrites=true&w=majority";
mongoose.connect(url, {
    useNewUrlParser: true
}).then(() => {
    console.log("Connected to DB!");
}).catch(err => {
    console.log("Error: cd ", err.message);
});

module.exports.Cart = require('./cart');