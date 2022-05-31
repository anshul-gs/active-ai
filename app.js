const express = require('express');
const app = express();
const db = require('./models/index');
app.get('/', (req, res) => {
    res.send('Homepage!');
})

app.get('/productlist', (req, res) => {
    let productList = [
        {
            name: "Raw Honey 1",
            image: "http://"
        },
        {
            name: "Raw Honey 2",
            image: "http://"
        },
        {
            name: "Raw Honey 3",
            image: "http://"
        }
    ];
    res.json(productList);
})

app.post('/addtocart', (req, res) => {
    console.log("in add to cart", req.body);
    let cart = req.body.cart;
    db.Cart.create(cart)
        .then(() => {
            res.send("Added to cart");
        })
        .catch((err) => {
            res.send(err);
        })
});

const port = process.env.port || 3000;
app.listen(port, (err) => {
    if (err) console.log(err);
    console.log("Server listening on port", port);
})

