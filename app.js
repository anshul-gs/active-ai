const express = require('express');
const app = express();
const db = require('./models/index');
const bodyParser = require('body-parser');

const userId = parseInt(Math.random() * 1000000);
console.log(userId)
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

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

app.post('/cart', async (req, res) => {
    console.log("in add to cart", req.body);
    req.body.userId = userId;
    let cart = req.body;
    await db.Cart.create(cart)
        .then((response) => {
            let j = {
                "status": "success",
                "templateCode": "FlightSelection",
                "payload": "[{\"flightName\":\"Air India\",\"orderNumber\":\"4055467223\",\"displayOrderNumber\":\"7223\",\"first_name\":\"USER11\",\"date\":\"1st May 2022\",\"isActive\":true},{\"flightName\":\"Indigo\",\"orderNumber\":\"45066127770\",\"displayOrderNumber\":\"7770\",\"first_name\":\"USER11\",\"date\":\"24th April 2022\",\"isActive\":true}]",
                "messageCode": "FlightSelection",
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

