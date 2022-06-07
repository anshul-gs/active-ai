const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const indexRoutes = require("./routes/index");
const productRoutes = require("./routes/product");
const cartRoutes = require("./routes/cart");
const orderRoutes = require("./routes/order");

app.use("/", indexRoutes);
app.use("/product", productRoutes);
app.use("/cart", cartRoutes);
app.use("/order", orderRoutes);

var port = process.env.PORT || 3000;
app.listen(port, '0.0.0.0', (err) => {
    if (err) console.log(err);
    console.log("Server listening on port", port);
})

