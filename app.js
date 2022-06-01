const express = require('express');
const app = express();
const db = require('./models/index');
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    let payload = { "id": "pid.1654068368355:901316919939321", "message": "", "payloadData": { "intent": "qry-product", "data": { "product.product": "Voney - Vegan, Plant Based Honey" } }, "allowMultipleClicks": true, "inTransaction": false, "signature": "2bf45d155d01e3a1d06ab2b313334ae3e9af0912", "langCode": "en" };
    console.log("-----", payload, payload.id, payload.message, payload.payloadData, payload.payloadData.intent);
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
    let body = JSON.parse(JSON.stringify(req.body));
    let payload = JSON.parse(body.request.payload);
    let userId = req.body.user.id;
    console.log("payload-----", payload);
    let cart = {
        name: payload.payloadData.data['product.product'],
        price: 20,
        userId: userId
    }
    console.log("cart---", cart)
    await db.Cart.create(cart)
        .then((response) => {
            console.log("response db", response)
            // let j = {
            //     "status": "success",
            //     "templateCode": "success",
            //     "payload": {
            //         "product": payload.payloadData.data["product.product"],
            //         "price": 20
            //     },
            //     "messageCode": "success",
            //     "messageParams": [
            //         "USER11",
            //         "xx5224"
            //     ]
            // }
            let j = {
                "messages": [{
                    "type": "text",
                    "content": "Hey!!!!!!!!!!!!!!!!!!!!",
                    "quick_replies": [{
                        "type": "text",
                        "title": "Search",
                        "payload": {
                            "product": payload.payloadData.data["product.product"],
                            "price": 20
                        },
                        "image_url": "http://example.com/img/red.png"
                    }, {
                        "type": "location"
                    }]
                }
                ],
                "render": "BOT",
                "keyboard_state": "ALPHA",
                "status": "SUCCESS",
                "expected_entities": [],
                "extra_data": [],
                "audit": {
                    "sub_intent": "",
                    "step": "",
                    "transaction_id": "",
                    "transaction_type": ""
                }
            };
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

