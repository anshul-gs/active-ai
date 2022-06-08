const express = require("express");
const router = express.Router();
const db = require('../models/index');

router.get('/', async (req, res) => {
    let frameResponse = {
        "status": "success",
        "templateCode": "viewProducts",
        "payload": []
    }
    await db.Product.find({ isGift: req.query.isGift, isSubscription: req.query.isSubscription })
        .then((response) => {
            for (let i in response) {
                frameResponse.payload.push({
                    name: response[i].name,
                    price: response[i].price,
                    image: response[i].image,
                    desc: response[i].desc,
                })
            }
            frameResponse.payload = JSON.stringify(frameResponse.payload);
            res.send(frameResponse);
        }).catch((err) => {
            throw new Error(err);
        })
});

router.post('/', (req, res) => {
    let product = {
        name: req.body.name,
        price: req.body.price,
        image: req.body.image,
        desc: req.body.desc,
        isGift: req.body.isGift,
        isSubscription: req.body.isSubscription
    }
    db.Product.create(product)
        .then((response) => {
            console.log("response", response);
            res.send(response);
        }).catch((err) => {
            throw new Error(err);
        })
});

module.exports = router;