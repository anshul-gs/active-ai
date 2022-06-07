const express = require("express");
const router = express.Router();
const db = require('../models/index');

router.post('/view', async (req, res) => {
    console.log("cart get", req.body, req.params, req.query);
    let frameResponse = {
        "status": "success",
        "messageCode": "cartView",
        "messageParams": []
    }

    await db.Cart.find({
        userId: req.body.user.id,
    }, null, { limit: 5, sort: { 'createdAt': -1 } })
        .then((response) => {
            console.log("response db", response);
            for (let i in response) {
                frameResponse.messageParams.push(response[i].name);
                frameResponse.messageParams.push(response[i].price);
            }
            frameResponse = JSON.parse(JSON.stringify(frameResponse));
            console.log("frameResponse", frameResponse)
            res.send(frameResponse);
        })
        .catch((err) => {
            throw new Error(err);
        })
});

router.post('/add', async (req, res) => {
    console.log("cart post", req.body);
    let body = JSON.parse(JSON.stringify(req.body));
    let payload = JSON.parse(body.request.payload);
    let userId = req.body.user.id;
    let price;
    await db.Product.find({ name: payload.payloadData.data['product.product'] })
        .then((productResponse) => {
            console.log("productResponse", productResponse);
            price = productResponse.price;
        })
    let cart = {
        name: payload.payloadData.data['product.product'],
        price: price,
        userId: userId
    }
    console.log("cart---", cart);
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