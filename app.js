const express = require('express');
const app = express();
const db = require('./models/index');
const bodyParser = require('body-parser');
const axios = require('axios');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.send("Welcome to Homepage!");
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
            let frameResponse = {
                "status": "success",
                "messageCode": "success",
                "messageParams": [
                    payload.payloadData.data["product.product"],
                    "20"
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

app.post('/callagent', async (req, res) => {
    console.log('get call', req.query, req.params, req.body);
    let callto = req.body.workflow.workflowVariables.sys_person_phone_number_ask;
    await axios.post('https://kpi.knowlarity.com/Basic/v1/account/call/makecall', {
        "k_number": "+911141123562",
        "agent_number": "+919168162979",
        "customer_number": "+91" + callto,
        "caller_id": "+911141123562"
    },
        {
            headers: {
                'Authorization': 'a86d7c03-abb4-11e6-982f-066beb27a027',
                'x-api-key': 'GesxeTJGz52ReWg8UBb8w7fTtqaCy1107E6bNZmG'
            }
        }).then((response) => {
            res.send("success", response);
        }).catch((err) => {
            res.send(err);
        });
})

app.post('/viewcart', async (req, res) => {
    console.log(req.body);
    let frameResponse = {
        "status": "success",
        "messageCode": "cartView",
        "messageParams": []
    }

    let newRes = {
        "status": "success",
        "templateCode": "cartDetails",
        "payload": {
            "name": "anshul"
        }
    }

    await db.Cart.find({
        userId: req.body.user.id,
    }, null, { limit: 2, sort: { 'createdAt': -1 } })
        .then((response) => {
            console.log("response db", response);
            for (let i in response) {
                frameResponse.messageParams.push(response[i].name);
                frameResponse.messageParams.push(response[i].price);
            }
            newRes.payload = JSON.stringify(newRes.payload);
            console.log("newRes", newRes)
            res.send(newRes);
        })
        .catch((err) => {
            throw new Error(err);
        })
});

app.post("/order", async (req, res) => {
    console.log(req.body);
})

var port = process.env.PORT || 3000;
app.listen(port, '0.0.0.0', (err) => {
    if (err) console.log(err);
    console.log("Server listening on port", port);
})

