const express = require("express");
const router = express.Router();
const axios = require('axios');

router.get('/', (req, res) => {
    res.send("Welcome to Meluka Honey - Active Bot!");
});

router.post('/callagent', async (req, res) => {
    console.log('get call', req.body);
    let callto;
    let from = "+919168162979";
    if (req.body.from) {
        from = "+91" + req.body.from;
    }
    if (req.body.workflow && req.body.workflow.workflowVariables.sys_person_phone_number_ask) {
        callto = "+91" + req.body.workflow.workflowVariables.sys_person_phone_number_ask;
    } else if (req.body.user && req.body.user.customer_id) {
        callto = "+" + req.body.user.customer_id;
    } else {
        callto = "+91" + req.body.to;
    }
    console.log("call to", callto);
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
            console.log("call response", response.data);
            res.send(response.data);
        }).catch((err) => {
            // console.log("call err", err);
            res.send(err);
        });
});

router.post('/room', async (req, res) => {
    let frameResponse = {
        "status": "success",
        "messageCode": "roomLink",
        "messageParams": []
    }
    await axios.post("https://presalesuat.gupshup.io/knowlarity/instantroom")
        .then((response) => {
            console.log("call response", response.data);
            frameResponse.messageParams.push(response.data.data.link);
            frameResponse = JSON.parse(JSON.stringify(frameResponse));
            console.log("frameResponse", frameResponse);
            res.json(frameResponse);
        }).catch((err) => {
            res.send(err);
        });
});

router.post('/medicine', (req, res) => {
    console.log("req----------------------------------", req.body);
    let text = req.body.request.text.toLowerCase();
    let frameResponse = {
        "status": "success",
        "messageCode": "medicine",
        "messageParams": []
    }
    if (text.includes('dolo')) {
        frameResponse.messageParams = [
            'Calpol 650',
            '45'
        ];
    } else if (text.includes('calpol')) {
        frameResponse.messageCode = "medi"
    } else if (text.includes('moov')) {
        frameResponse.messageParams = [
            'Volini Gel',
            '30'
        ];
    } else if (text.includes('volini')) {
        frameResponse.messageCode = "medi"
    }
    frameResponse = JSON.parse(JSON.stringify(frameResponse));
    res.json(frameResponse);
});

router.post('/onedirect', async (req, res) => {
    console.log("req----------------------------------", req.body);
    let sessionId;
    let inRes;
    let data1 = JSON.stringify({
        actionType: 'CUSTOMER_MSG',
        channel: 'WHATSAPP',
        contentType: 'TEXT',
        msgText: req.body.request.text, //
        attachmentUrl: null,
        caption: null,
        customerId: req.body.user.channel_id, //
        brandAccount: "+911204118404",
        initialAttribute: {
            chatField: [],
            customerField: [],
        },
        botId: 1011,
        botName: "healthcarebot",
        nodeInfo: {
            nodeId: req.body.workflow.nodeId, //
            name: req.body.workflow.nodeId, //
            parentId: req.body.workflow.workflowId, //
            flowName: req.body.workflow.workflowId, //
            flowId: req.body.workflow.workflowId, //
            inputs: null,
            action: 'HANDLED',
        },
    });
    console.log("INBOUND", JSON.parse(data1));
    await axios.post("https://gupshup.onedirect.in/mgateway/public/callback", data1, {
        headers: {
            apiKey:
                "d1ffe26594c33d37ead7e0e7d60acc7240b7a1a0f8baa31a79f6d1004d17b0eb",
            "Content-Type": "application/json",
        }
    }).then((response) => {
        sessionId = response.data.sessionId;
        inRes = response.data;
        console.log("call response", response.data);
        // res.send(response.data);
    }).catch((err) => {
        console.log("call err", err);
        // res.send(err);
    });

    let data2 = JSON.stringify({
        actionType: 'BOT_MSG',
        channel: 'WHATSAPP',
        sessionId: sessionId, //
        flowId: 243, //
        flowName: req.body.workflow.workflowId, //
        flowVersion: 1,
        flowEnd: false,
        botInfo: {
            id: 1011,
            name: "healthcarebot",
            messages: [
                {
                    nodeId: req.body.workflow.nodeId, //
                    nodeName: req.body.workflow.nodeId, //
                    parentNodeId: req.body.workflow.workflowId, //
                    msgId: (Math.random() + 1).toString(36).substring(2),
                    type: 'SEND_MESSAGE',
                    msgText: JSON.stringify(inRes), //
                    contentType: 'TEXT',
                    attachmentUrl: null,
                    caption: null,
                },
            ],
            talkToHuman: false,
        },
    });
    console.log("OUTBOUND", JSON.parse(data2));
    await axios.post("https://gupshup.onedirect.in/mgateway/public/callback", data2, {
        headers: {
            apiKey:
                "d1ffe26594c33d37ead7e0e7d60acc7240b7a1a0f8baa31a79f6d1004d17b0eb",
            "Content-Type": "application/json",
        }
    }).then((response) => {
        console.log("call response", response.data);
        // res.send(response.data);
    }).catch((err) => {
        console.log("call err", err);
        // res.send(err);
    });
    res.send("success");
});

module.exports = router;