const router = require('express').Router();
const config = require('config');
const sha1 = require('sha1');
const accessToken = require('../libs/accessToken');
const weChat = require('../libs/weChat');
const { tmp } = require('../libs/method');

router.get('/', (req, res) => {
    let { signature, timestamp, nonce, echostr } = req.query;
    let sortStr = [timestamp, nonce, config.app.token].sort().join('');
    console.log('--------娇艳签名');
    sha1(sortStr) === signature ? res.send(echostr) : res.send('wrong');
});

router.post('/', async (req, res) => {
    let message = await weChat.mxlToObject(req.body.toString());
    console.log(message);
    let result = '';
    let content = '';
    if (message.MsgType === 'event') {
        if (message.Event === 'subscribe') {
            if (message.EventKey) {
                console.log(`扫描二维码进来:${message.EventKey} ${message.ticket}`);
            }
            content = '哈哈，很高兴认识你，希望你每天开心快乐!';
        } else if (message.Event === 'subscribe') {
            console.log('无情取关!');
        }
    } else {
        content = '你好，我是小爱同学，请问有什么可以帮助你的吗？';
    }
    result = tmp(content, message);
    res.type('application/xml');
    res.status(200);
    return res.end(result);
})

module.exports = router;