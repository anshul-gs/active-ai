const express = require("express");
const router = express.Router();
const axios = require('axios');
const package = require('../package.json');

router.get('/', (req, res) => {
    res.send("Welcome to Meluka Honey - Active Bot!");
});

router.post('/callagent', async (req, res) => {
    console.log('get call', req.query, req.params, req.body);
    let callto;
    if (req.body.workflow) {
        callto = req.body.workflow.workflowVariables.sys_person_phone_number_ask;
    } else {
        callto = req.body.to;
    }
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
        })
});

module.exports = router;