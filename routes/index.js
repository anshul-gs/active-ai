const express = require("express");
const router = express.Router();
const axios = require('axios');
const { readPdf } = require('../util');

router.get('/', (req, res) => {
    res.send("Welcome to Meluka Honey - Active Bot!");
});

router.post('/getNumber', async (req, res) => {
    console.log('get call', req.body);
    let frameResponse = {
        "status": "success",
        "templateCode": "getNumber",
        "payload": {
            number: req.body.user.channel_id
        }
    }
    console.log("frameResponse-----", frameResponse);
    res.send(frameResponse);
});

router.post('/callHealth', async (req, res) => {
    let from = "+917353937377";
    let number;
    if (req.body.request.text.length == 10 && !isNaN(parseInt(req.body.request.text))) {
        number = req.body.request.text;
    }
    let callto = number ? "+91" + number : "+" + req.body.user.channel_id;
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
    }
    if (text.includes('dolo')) {
        frameResponse.templateCode = "medicine";
        frameResponse.payload = {
            name: "Calpol 650",
            price: 45,
            url: "https://onemg.gumlet.io/l_watermark_346,w_480,h_480/a_ignore,w_480,h_480,c_fit,q_auto,f_auto/clpmvl3fpvnn4s3epnm6.jpg"
        }
    } else if (text.includes('calpol')) {
        frameResponse.messageCode = "medi";
    } else if (text.includes('moov')) {
        frameResponse.templateCode = "medicine";
        frameResponse.payload = {
            name: "Volini Gel",
            price: 30,
            url: "https://www.netmeds.com/images/product-v1/600x600/800318/volini_gel_30gm_0_1.jpg"
        }
    } else if (text.includes('volini')) {
        frameResponse.messageCode = "medi"
    } else if (text.includes('para')) {
        frameResponse.templateCode = "medicine";
        frameResponse.payload = {
            name: "Ibuprofen",
            price: 55,
            url: "data:image/jpeg;base64,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"
        }
    } else if (text.includes('ibu')) {
        frameResponse.messageCode = "medi"
    } else if (text.includes('cro')) {
        frameResponse.templateCode = "medicine";
        frameResponse.payload = {
            name: "Paracin",
            price: 31,
            url: "data:image/jpeg;base64,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"
        }
    } else if (text.includes('paracin')) {
        frameResponse.messageCode = "medi"
    }
    frameResponse.payload = JSON.stringify(frameResponse.payload);
    console.log(frameResponse);
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

router.post('/pan', async (req, res) => {
    console.log("req----------------------------------", req.body);
    let image = req.body.url ? req.body.url : 'https://5.imimg.com/data5/TP/US/MU/SELLER-51778781/pan-card-1000x1000.jpg';
    let frameResponse = {
        "status": "success",
        "templateCode": "panDetails",
        "payload": {}
    }
    await readPdf(image, 'pan', (parsedText) => {
        console.log('parsedText-----------', parsedText);
        if (parsedText.text.IsErroredOnProcessing) {
            res.send(parsedText.text.ErrorMessage);
        } else {
            if (parsedText && parsedText.text && parsedText.text.ParsedResults[0] && parsedText.text.ParsedResults[0].ParsedText) {
                parsedText = parsedText.text.ParsedResults[0].ParsedText;
                frameResponse.payload = {
                    pan: parsedText.slice(parsedText.indexOf('Number') + 8, parsedText.indexOf('Number') + 18) ? parsedText.slice(parsedText.indexOf('Number') + 8, parsedText.indexOf('Number') + 18) : null,
                    dob: parsedText.match("[0-9]{2}([\-/ \.])[0-9]{2}[\-/ \.][0-9]{4}") ? parsedText.match("[0-9]{2}([\-/ \.])[0-9]{2}[\-/ \.][0-9]{4}")[0] : null,
                    name: parsedText.split(/\r|\n/g) ? parsedText.split(/\r|\n/g)[2] : null
                }
                console.log('frameResponse-----------', frameResponse);
                frameResponse.payload = JSON.stringify(frameResponse.payload);
                res.send(frameResponse);
            } else {
                res.send(frameResponse);
            }
        }
    });
});

router.post('/cheque', async (req, res) => {
    console.log("req----------------------------------", req.body);
    let image = req.body.url ? req.body.url :
        'https://filemanager.gupshup.io/fm/wamedia/demobot1/bd2e0137-2040-429c-9ef3-51f50a68cb7f' // anshul
    // 'https://filemanager.gupshup.io/fm/wamedia/demobot1/26383814-2bd0-4599-99f9-fbd238a3cf19' //mridul
    // 'https://miro.medium.com/max/1400/0*0X8Z8EXF0mXUSLvB.jpg'
    // 'https://pbs.twimg.com/media/DhPmjGJU0AESQBw?format=jpg&name=4096x4096';
    // https://www.researchgate.net/profile/Chinmaya-Panda-4/publication/329019514/figure/fig4/AS:984139926880259@1611648651475/Sample-image-of-a-bank-cheque.jpg
    let frameResponse = {
        "status": "success",
        "templateCode": "chequeDetails",
        "payload": {}
    }
    await readPdf(image, 'cheque', async (parsedText) => {
        console.log('parsedText-----------', parsedText);
        if (parsedText.text.IsErroredOnProcessing) {
            res.send(parsedText.text.ErrorMessage);
        } else {
            if (parsedText && parsedText.text && parsedText.text.ParsedResults[0] && parsedText.text.ParsedResults[0].ParsedText) {
                parsedText = parsedText.text.ParsedResults[0].ParsedText.toLowerCase();
                //     let account = parsedText.indexOf('code'));
                trimParsedText = parsedText.replace(/\n|\r|\t/g, "");
                let findCode;
                if (trimParsedText.indexOf('code')) {
                    findCode = trimParsedText.indexOf('code');
                }
                console.log('findCode-----------', findCode);
                let findAccount;
                if (trimParsedText.indexOf('no.') || trimParsedText.indexOf('a/cno.') || trimParsedText.indexOf('account') || trimParsedText.indexOf('a/c')) {
                    findAccount = trimParsedText.indexOf('no.') || trimParsedText.indexOf('a/cno.') || trimParsedText.indexOf('account') || trimParsedText.indexOf('a/c');
                }
                console.log('findAccount-----------', findAccount, trimParsedText);
                frameResponse.payload = {
                    account: trimParsedText.slice(findAccount + 3, findAccount + 15),
                    ifsc: trimParsedText.slice(findCode + 5, findCode + 17),
                    // name: 'abc'
                }
                if (frameResponse.payload.ifsc.length > 0) {
                    await axios.get('https://ifsc.razorpay.com/' + (frameResponse.payload.ifsc.trim().toUpperCase()))
                        .then((response) => {
                            console.log('response from razorpay-----------', response.data);
                            frameResponse.payload.branchDetails = response.data;
                        }).catch((error) => {
                            console.error(error);
                        })
                }
                console.log('frameResponse-----------', frameResponse);
                frameResponse.payload = JSON.stringify(frameResponse.payload);
                res.send(frameResponse);
            } else {
                res.send(frameResponse);
            }
        }
    });
});

module.exports = router;