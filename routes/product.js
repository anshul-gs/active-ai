const express = require("express");
const router = express.Router();
const db = require('./models/index');

router.get('/productlist', (req, res) => {
    let productList = [
        {
            name: "Raw Honey 1",
            image: "http://"
        },
        {
            name: "Raw Honey 2",
            image: "http://"
        },
    ];
    res.json(productList);
});

module.exports = router;