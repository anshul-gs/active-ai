const express = require("express");
const router = express.Router();
const db = require('../models/index');

router.post('/view', async (req, res) => {
    console.log("cart view", req.body);
    let frameResponse = {
        "status": "success",
        "templateCode": "cartView",
        "payload": {
            "product": [],
            "total": 0
        }
    }

    await db.Cart.aggregate([{
        $match: { userId: req.body.user.id }
    }, {
        $group: {
            _id: "$name",
            name: { $first: "$name" },
            price: { $first: "$price" },
        }
    },
    { $sort: { createdAt: -1 } },
    { $limit: 5 }
    ]).exec(async (err, response) => {
        if (err) throw new Error(err);
        console.log("response db", response);
        for (let i in response) {
            frameResponse.payload.product.push({
                name: response[i].name,
                price: response[i].price
            });
            frameResponse.payload.total = frameResponse.payload.total + parseInt(response[i].price);
        }
        frameResponse.payload = JSON.stringify(frameResponse.payload);
        console.log("frameResponse", frameResponse);
        res.send(frameResponse);
    });
});

router.post('/add', async (req, res) => {
    console.log("cart add", req.body);
    let body = JSON.parse(JSON.stringify(req.body));
    let payload = JSON.parse(body.request.payload);
    let userId = req.body.user.id;
    let price;
    await db.Product.find({ name: payload.payloadData.data['product.product'] })
        .then((productResponse) => {
            console.log("productResponse", productResponse[0]);
            price = productResponse[0].price;
        })
    let cart = {
        name: payload.payloadData.data['product.product'],
        price: price,
        userId: userId
    }
    console.log("cart", cart);
    await db.Cart.create(cart)
        .then((response) => {
            console.log("response db", response)
            let frameResponse = {
                "status": "success",
                "messageCode": "success",
                "messageParams": [
                    payload.payloadData.data["product.product"],
                    price
                ]
            }
            frameResponse = JSON.parse(JSON.stringify(frameResponse));
            console.log("res from db", frameResponse);
            res.json(frameResponse);
        })
        .catch((err) => {
            res.send(err);
        })
});

module.exports = router;