const express = require('express');
const app = express();
const db = require('./models/index');
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    let payload = '{"id":"pid.1654067665840:715433123308423","message":"","payloadData":{"intent":"qry-product","data":{"product.product":"Voney - Vegan, Plant Based Honey"}},"allowMultipleClicks":true,"inTransaction":false,"signature":"1eed98c49e20f984b3abc183ef8228f4255ab975","langCode":"en"}';
    payload = JSON.parse(JSON.stringify(payload));
    res.send(payload);
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

app.post('/cart', async (req, res) => {
    console.log("in add to cart", req.body);
    let userId = req.body.user.id;
    let payload = JSON.parse(JSON.stringify(req.body.payload));
    let cart = {
        product: payload.payloadData.data["product.product"],
        price: 20,
        userId: userId
    }
    console.log("cart---", cart)
    await db.Cart.create(cart)
        .then((response) => {
            console.log("response db", response)
            let j = {
                "status": "success",
                "templateCode": "success",
                "payload": {
                    "product": payload.payloadData.data["product.product"],
                    "price": 20
                },
                "messageCode": "success",
                "messageParams": [
                    "USER11",
                    "xx5224"
                ]
            }
            j = JSON.parse(JSON.stringify(j));
            console.log("res from db", j);
            res.json(j);
        })
        .catch((err) => {
            res.send(err);
        })
});

var port = process.env.PORT || 3000;
app.listen(port, '0.0.0.0', (err) => {
    if (err) console.log(err);
    console.log("Server listening on port", port);
})

