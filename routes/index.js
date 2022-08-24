const express = require("express");
const router = express.Router();
const axios = require('axios');
const { readPdf } = require('../util');
const path = require('path')

router.get('/', (req, res) => {
    res.send("Welcome to Meluka Honey - Active Bot!");
});

router.get('/matador', (req, res) => {
    res.sendFile(path.resolve('matador.html'));
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
        }
    } else if (text.includes('ibu')) {
        frameResponse.messageCode = "medi"
    } else if (text.includes('cro')) {
        frameResponse.templateCode = "medicine";
        frameResponse.payload = {
            name: "Paracin 1000mg",
            price: 31,
        }
    } else if (text.includes('paracin')) {
        frameResponse.messageCode = "medi"
    }
    if (frameResponse.payload) {
        frameResponse.payload = JSON.stringify(frameResponse.payload);
    }
    if (frameResponse.messageCode) {
        frameResponse = JSON.parse(JSON.stringify(frameResponse));
    }
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