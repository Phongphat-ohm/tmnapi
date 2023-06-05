const twApi = require('@opecgame/twapi')
const readline = require('readline');
const express = require('express')
const app = express();
const fs = require('fs');
const { log } = require('console');
const bodyParser = require('body-parser');

app.use(express.json());

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

async function getWallet(code, phoneNumber) {
    const tw = await twApi(code, '0994475548'/*phoneNumber*/);
    const result = [];
    switch (tw.status.code) {
        case "SUCCESS":
            result.push({
                status: "SUCCESS",
                message: 'ไดรับเงินแล้ว',
                amount: tw.data.my_ticket.amount_baht
            });
            break;
        case "CANNOT_GET_OWN_VOUCHER":
            result.push({
                status: "CANNOT_GET_OWN_VOUCHER",
                message: 'รับซองตัวเองไม่ได้'
            });
            break;
        case "TARGET_USER_NOT_FOUND":
            result.push({
                status: "TARGET_USER_NOT_FOUND",
                message: 'ไม่พบเบอร์นี้ในระบบ'
            });
            break;
        case "INTERNAL_ERROR":
            result.push({
                status: "INTERNAL_ERROR",
                message: 'ไม่ซองนี้ในระบบ หรือ URL ผิด'
            });
            break;
        case "VOUCHER_OUT_OF_STOCK":
            result.push({
                status: "VOUCHER_OUT_OF_STOCK",
                message: 'มีคนรับไปแล้ว'
            });
            break;
        case "VOUCHER_NOT_FOUND":
            result.push({
                status: "VOUCHER_NOT_FOUND",
                message: 'ไม่พบซองในระบบ'
            });
            break;
        case "VOUCHER_EXPIRED":
            result.push({
                status: "VOUCHER_EXPIRED",
                message: 'ซองวอเลทนี้หมดอายุแล้ว'
            });
            break;
        default:
            break;
    }
    return tw.status.code;
}

// app.post('/1', (req, res) => {
//     const url = req.body;
//     getWallet(url).then(result => {
//         res.send(result)
//     }).catch(error => {
//         res.status(400).send("Error: " + error);
//     });
//     log(url)
//     res.send(url)
// });

getWallet("https://gift.truemoney.com/campaign/?v=bgavSkg5hspZYKzcdk", 0994475548).then(result => {
    console.log(result)
}).catch(error => {
    console.log(error)
});

// https://gift.truemoney.com/campaign/?v=bgavSkg5hspZYKzcdk

app.listen(3000, () => {
    console.log("Listen On Port 3000");
})