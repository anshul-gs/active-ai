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
        if (response.length > 0) {
            for (let i in response) {
                frameResponse.payload.product.push({
                    name: response[i].name,
                    price: "- ($" + response[i].price + ")"
                });
                frameResponse.payload.total = frameResponse.payload.total + parseInt(response[i].price);
            }
            frameResponse.payload = JSON.stringify(frameResponse.payload);
            console.log("frameResponse", frameResponse);
            res.send(frameResponse);
        } else {
            let failResponse = {
                "status": "success",
                "messageCode": "cartNull",
                "messageParams": [
                    "Your Cart is empty. Please add some products."
                ]
            }
            failResponse = JSON.parse(JSON.stringify(failResponse));
            console.log("failResponse", failResponse)
            res.send(failResponse);
        }
    });
});

router.post('/add', async (req, res) => {
    console.log("cart add", req.body);
    let body = JSON.parse(JSON.stringify(req.body));
    let payload = JSON.parse(body.request.payload);
    let userId = req.body.user.id;
    let price;
    console.log("payload", payload);

    let productDefinition;
    if (payload.payloadData.data['product.product']) {
        productDefinition = payload.payloadData.data['product.product'];
    } else if (payload.payloadData.data['product.gift']) {
        productDefinition = payload.payloadData.data['product.gift'];
    } else if (payload.payloadData.data['product.subscription']) {
        productDefinition = payload.payloadData.data['product.subscription']
    }
    console.log("productDefinition", productDefinition);

    await db.Product.find({ name: productDefinition })
        .then((productResponse) => {
            console.log("productResponse", productResponse);
            price = productResponse[0].price;
        })
    let cart = {
        name: productDefinition,
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
                    productDefinition,
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