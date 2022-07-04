const express = require("express");
const router = express.Router();
const db = require('../models/index');
const transaction = [
    {
        date: "30-May-2022",
        type: "Credit",
        amount: "18000",
        referenceNo: "UPI-22xxxxx56",
        toName: "Friend",
        toCategory: "bank"
    },
    {
        date: "30-May-2022",
        type: "Debit",
        amount: "-2000",
        referenceNo: "UPI-22xxxxx24",
        toName: "Flipkart",
        toCategory: "ecommerce"
    },
    {
        date: "29-May-2022",
        type: "Credit",
        amount: "75000",
        referenceNo: "CMS-22xxxxx57",
        toName: "Company",
        toCategory: "bank"
    },
    {
        date: "28-May-2022",
        type: "Debit",
        amount: "-250",
        referenceNo: "UPI-21xxxxxS1",
        toName: "Snacks Center",
        toCategory: "food"
    },
    {
        date: "25-May-2022",
        type: "Debit",
        amount: "-887",
        referenceNo: "22xxxxx09",
        toName: "Banjara Dhaba",
        toCategory: "food"
    },
    {
        date: "20-May-2022",
        type: "Debit",
        amount: "-1020",
        referenceNo: "22xxxxx4T",
        toName: "Amazon",
        toCategory: "ecommerce"
    },
    {
        date: "10-May-2022",
        type: "Debit",
        amount: "-1340",
        referenceNo: "22xxxxx99",
        toName: "Swiggy",
        toCategory: "food"
    },
    {
        date: "05-May-2022",
        type: "Credit",
        amount: "1934.3",
        referenceNo: "CMS-22xxxxx11",
        toName: "Friend",
        toCategory: "bank"
    },
    {
        date: "04-May-2022",
        type: "Debit",
        amount: "-1783.03",
        referenceNo: "CMS-22xxxxx46",
        toName: "KSPAYOUT",
        toCategory: "bank"
    },
    {
        date: "04-May-2022",
        type: "Debit",
        amount: "-1003.21",
        referenceNo: "21xxxxx40",
        toName: "Zomato",
        toCategory: "food"
    }
]

router.post('/', async (req, res) => {
    console.log("req", req.body.nlp, req.body.nlp['intent'], req.body.nlp['intents'], req.body.nlp['entities']);
    res.send("hi");
});

module.exports = router;