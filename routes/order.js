const express = require("express");
const router = express.Router();
const db = require('../models/index');

router.post("/", async (req, res) => {
    console.log("req", req.body, req.query, req.params);
    let order = {
        product: [],
        total: 0,
    }
    let frameResponse = {
        "status": "success",
        "messageCode": "orderSuccess",
        "messageParams": []
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
        if (response.length > 0) {
            for (let i in response) {
                order.product.push({
                    name: response[i].name,
                    price: response[i].price
                });
                order.total = order.total + parseInt(response[i].price);
            }
            order.userId = req.body.user.id;
            await db.Order.create(order)
                .then(async (orderResponse) => {
                    await db.Cart.deleteMany({ userId: req.body.user.id })
                        .then((deleteResponse) => {
                            console.log("deleteResponse", deleteResponse);
                        })
                        .catch((err) => {
                            throw new Error(err);
                        })

                    frameResponse.messageParams.push(orderResponse.total);
                    for (let i in orderResponse.product) {
                        frameResponse.messageParams.push(orderResponse.product[i].name);
                    }
                    for (let i in 5) {
                        frameResponse.messageParams.push(" ");
                    }
                    console.log("orderResponse", orderResponse);
                    frameResponse = JSON.parse(JSON.stringify(frameResponse));
                    console.log("frameResponse", frameResponse)
                    res.send(frameResponse);
                })
                .catch((err) => {
                    throw new Error(err);
                })
        } else {
            let failResponse = {
                "status": "success",
                "messageCode": "orderFailed",
                "messageParams": []
            }
            failResponse = JSON.parse(JSON.stringify(failResponse));
            console.log("failResponse", failResponse)
            res.send(failResponse);
        }
    })
});

module.exports = router;