const express = require("express");
const router = express.Router();
const db = require('./models/index');

router.post("/order", async (req, res) => {
    console.log(req.body);
});

module.exports = router;