const express = require('express');
const app = express();
const bodyParser = require('body-parser');
require('dotenv').config();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const indexRoutes = require("./routes/index");
const productRoutes = require("./routes/product");
const cartRoutes = require("./routes/cart");
const orderRoutes = require("./routes/order");
const transactionRoutes = require("./routes/transaction");

app.use("/", indexRoutes);
app.use("/product", productRoutes);
app.use("/cart", cartRoutes);
app.use("/order", orderRoutes);
app.use("/transaction", transactionRoutes);
app.use(express.static(__dirname + '/public'));

var port = process.env.PORT || 3000;
app.listen(port, '0.0.0.0', (err) => {
    if (err) console.log(err);
    console.log("Server listening on port", port);
});
