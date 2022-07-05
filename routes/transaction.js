const express = require("express");
const router = express.Router();
const db = require('../models/index');
let demoTransaction = [
    {
        "date": "30-May-2022",
        "type": "Credit",
        "amount": 18000,
        "referenceNo": "UPI-22xxxxx56",
        "toName": "Friend",
        "toCategory": "bank"
    },
    {
        "date": "30-May-2022",
        "type": "Debit",
        "amount": -2000,
        "referenceNo": "UPI-22xxxxx24",
        "toName": "Flipkart",
        "toCategory": "ecommerce"
    },
    {
        "date": "29-May-2022",
        "type": "Credit",
        "amount": 75000,
        "referenceNo": "CMS-22xxxxx57",
        "toName": "Company",
        "toCategory": "bank"
    },
    {
        "date": "28-May-2022",
        "type": "Debit",
        "amount": -250,
        "referenceNo": "UPI-21xxxxxS1",
        "toName": "Snacks Center",
        "toCategory": "food"
    },
    {
        "date": "25-May-2022",
        "type": "Debit",
        "amount": -887,
        "referenceNo": "22xxxxx09",
        "toName": "Banjara Dhaba",
        "toCategory": "food"
    },
    {
        "date": "20-May-2022",
        "type": "Debit",
        "amount": -1020,
        "referenceNo": "22xxxxx4T",
        "toName": "Amazon",
        "toCategory": "ecommerce"
    },
    {
        "date": "10-May-2022",
        "type": "Debit",
        "amount": -1340,
        "referenceNo": "22xxxxx99",
        "toName": "Swiggy",
        "toCategory": "food"
    },
    {
        "date": "05-May-2022",
        "type": "Credit",
        "amount": 19340,
        "referenceNo": "CMS-22xxxxx11",
        "toName": "Friend",
        "toCategory": "bank"
    },
    {
        "date": "04-May-2022",
        "type": "Debit",
        "amount": -1783.03,
        "referenceNo": "CMS-22xxxxx46",
        "toName": "KSPAYOUT",
        "toCategory": "bank"
    },
    {
        "date": "04-May-2022",
        "type": "Debit",
        "amount": -1003.21,
        "referenceNo": "21xxxxx40",
        "toName": "Zomato",
        "toCategory": "food"
    }
]

router.post('/', async (req, res) => {
    let body = JSON.parse(JSON.stringify(req.body));
    let nlp = JSON.parse(JSON.stringify(body.nlp));
    console.log("nlp intent", nlp.data['intent']);
    console.log("nlp intents", nlp.data['intents']);
    console.log("nlp entities", nlp.data['entities']);
    console.log("nlp-------", body)
    res.send("hi");
});

router.post('/create', async (req, res) => {
    // let transaction = {
    //     date: req.body.date,
    //     type: req.body.type,
    //     amount: req.body.amount,
    //     referenceNo: req.body.referenceNo,
    //     toName: req.body.toName,
    //     toCategory: req.body.toCategory
    // }
    await db.Transaction.insertMany(req.body)
        .then((response) => {
            console.log("response db", response)
            res.send('success');
        }).catch((err) => {
            res.send(err);
        })
});

module.exports = router;