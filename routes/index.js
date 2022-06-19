const express = require("express");
const router = express.Router();
const axios = require('axios');

router.get('/', (req, res) => {
    res.send("Welcome to Meluka Honey - Active Bot!");
});

router.post('/callagent', async (req, res) => {
    console.log('get call', req.query, req.params, req.body);
    let callto;
    let from = "+919168162979";
    if (req.body.from) {
        from = "+91" + req.body.from;
    }
    if (req.body.workflow) {
        callto = "+91" + req.body.workflow.workflowVariables.sys_person_phone_number_ask;
    } else if (req.body.user && req.body.user.customer_id) {
        callto = "+" + req.body.user.customer_id;
    }
    else {
        callto = "+91" + req.body.to;
    }
    await axios.post('https://kpi.knowlarity.com/Basic/v1/account/call/makecall', {
        "k_number": "+911141123562",
        "agent_number": from,
        "customer_number": callto,
        "caller_id": "+911141123562"
    },
        {
            headers: {
                'Authorization': 'a86d7c03-abb4-11e6-982f-066beb27a027',
                'x-api-key': 'GesxeTJGz52ReWg8UBb8w7fTtqaCy1107E6bNZmG'
            }
        }).then((response) => {
            // console.log("call response", response.data);
            res.send(response.data);
        }).catch((err) => {
            // console.log("call err", err);
            res.send(err);
        })
});

module.exports = router;